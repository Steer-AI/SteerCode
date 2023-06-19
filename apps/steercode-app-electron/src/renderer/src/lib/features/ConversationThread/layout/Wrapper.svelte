<script lang="ts">
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { _ } from 'svelte-i18n';
  import SendIcon from '$lib/shared/components/Icons/SendIcon.svelte';
  import VirtualScroll from 'svelte-virtual-scroll-list';
  import type {
    ChatMessageDTO,
    ChatMode,
    CompletionResponse,
    RepositoryOption
  } from '$lib/models/types/conversation.type';
  import { browser } from '$app/environment';
  import Divider from '$lib/shared/components/Divider.svelte';
  import Listbox, {
    type Option
  } from '$lib/shared/components/Listbox/Listbox.svelte';
  import { selectedRepositoryStore } from '$lib/shared/stores/recentRepositories';

  import { fetchStream } from '$lib/features/ConversationThread/utils/streaming';
  import type { EventSourceMessage } from '@microsoft/fetch-event-source';
  import type { IFileContentItem } from 'cognitic-models';
  import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';

  import { initialFileTreeFile } from '$lib/shared/stores/selectedRepository';
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';

  export let loading: boolean = false;
  export let submitDisabled: boolean = false;
  export let messages: ChatMessageDTO[] = [];
  export let chatModeValue: ChatMode = 'chat';
  export let techStackValue: string = '';

  let streamController: AbortController;

  let unsubscriber = selectedRepositoryStore.subscribe(async (value) => {
    if (!value || value.description === techStackValue) return;
    if (value.description) {
      techStackValue = value.description;
    } else {
      techStackValue = '';
      await fetchTechStackDescription(value);
    }
  });

  async function fetchTechStackDescription(value: RepositoryOption) {
    console.log('fetching tech stack description for', { ...value });
    closeEventSource();
    streamController = new AbortController();

    const selections = $selectedEntities;
    const contents: [IFileContentItem] = await window.electron.getContents(
      selections.map((selection) => selection.filePath)
    );
    const documents = contents.map((content) => {
      return {
        page_content: content.fileContent,
        metadata: {
          file_path: content.filePath
        }
      };
    });

    const body = {
      id: 'techStackDescription',
      uid: 'techStackDescription',
      title: 'Tech Stack Description',
      repository: $selectedRepositoryStore!,
      messages: [
        {
          id: 'techStackDescription',
          conversation_id: 'techStackDescription',
          content:
            'Create a list of technologies used in this repository. Only return comma separated values. Do not describe the technologies. Return 4-6 most relevant technologies. Make sure to include the programming language, framework, and database. \n\n An example: Python, Django, PostgreSQL',
          role: 'user',
          created_at: new Date().toISOString(),
          user_feedback: null
        }
      ],
      created_at: new Date().toISOString(),
      documents,
      root_directory: $initialFileTreeFile,
      technology_description: '',
      chat_mode: 'tech_stack'
    };

    await fetchStream('/chat/generate_description', {
      body,
      streamController,
      onMessage,
      onClose: closeEventSource
    });
  }

  function closeEventSource() {
    streamController?.abort();
  }

  function onMessage(e: EventSourceMessage) {
    const completionResponse = JSON.parse(e.data) as CompletionResponse;
    const content = completionResponse.msg;

    if (completionResponse.done) {
      techStackValue = content;
      return;
    }

    if (completionResponse.error) {
      throw new Error(content);
    }

    if (content) {
      techStackValue = (techStackValue ?? '') + content;
    }
  }

  export function scrollToBottom(force: boolean = false) {
    // we used flex-direction: column-reverse to show the messages in reverse order thus scrollTop is negative
    const offsetDiff =
      scrollToDiv.offsetTop +
      scrollToDiv.clientHeight -
      list.getOffset() -
      list.getClientSize();
    if (offsetDiff < 10 || force) {
      list.scrollToBottom();
    }
  }

  const dispatch = createEventDispatcher();

  let scrollToDiv: HTMLDivElement;

  let query: string = '';

  let list: VirtualScroll;

  let formHeight: number = 0;

  let chatOptions: Option<ChatMode>[] = [];
  let defaultValueFromLS = localStorage.getItem('cognitic.chatModeOption');

  $: chatOptions = [
    { label: $_('conversation.chatMode.optionChat'), value: 'chat' },
    { label: $_('conversation.chatMode.optionCode'), value: 'code' },
    { label: $_('conversation.chatMode.optionDebug'), value: 'debug' },
    { label: $_('conversation.chatMode.optionExplain'), value: 'explain' }
  ];
  $: chatMode = defaultValueFromLS
    ? JSON.parse(defaultValueFromLS)
    : chatOptions[0];

  $: chatModeValue = chatMode.value;

  onDestroy(() => {
    closeEventSource();
    unsubscriber && unsubscriber();
  });
</script>

<section class="relative flex h-full w-full flex-col items-center">
  <div
    class="bg-background-primary flex h-14 w-full flex-shrink-0 items-center px-6"
  >
    <Listbox
      selected={chatMode}
      on:change={(e) => {
        localStorage.setItem(
          'cognitic.chatModeOption',
          JSON.stringify(e.detail)
        );
        chatMode = e.detail;
      }}
      options={chatOptions}
    >
      <div slot="label" class="label-small text-content-secondary mr-4">
        {$_('conversation.chatMode.label')}
      </div>
    </Listbox>

    <Divider vertical class="mx-2 h-8" />

    <TextAreaField
      labelClass="flex flex-1 justify-end items-center"
      class="label-regular w-full flex-grow px-2 pt-1 align-bottom normal-case "
      style="height: 26px; max-width: 500px; text-transform: none; font-size: 14px;"
      bind:value={techStackValue}
      on:blur={() => {
        recentRepositories.changeDescription(
          $selectedRepositoryStore,
          techStackValue
        );
      }}
    >
      <div slot="label" class="label-small text-content-secondary mr-4">
        {$_('conversation.techStack.label')}
      </div>
    </TextAreaField>
  </div>
  <Divider class="w-full" />

  <div class="h-full w-full" style="max-height: calc(100% - 57px)">
    {#if browser}
      <VirtualScroll bind:this={list} data={messages} key="id" let:data>
        <ChatMessage
          type={data.role}
          message={data.content}
          messageFeedback={data.user_feedback}
          on:delete={() => {
            dispatch('deleteMessage', data);
          }}
          deletable={false}
          editable={data.role === 'user'}
          on:feedback={(e) => {
            dispatch('feedback', { message: data, feedback: e.detail });
          }}
          on:edit={(e) => {
            dispatch('edit', { message: data, content: e.detail });
          }}
        />
        <div slot="footer">
          <slot />
          {#if loading}
            <ChatMessage
              type="system"
              message={$_('conversation.message.loading')}
            />
          {/if}
          <div
            role="separator"
            style="height: {formHeight}px;"
            bind:this={scrollToDiv}
          />
        </div></VirtualScroll
      >
    {/if}
  </div>

  <div
    class="absolute bottom-0 left-1/2 z-10 w-full max-w-5xl -translate-x-1/2"
    style="background: linear-gradient(0deg, #09090B 25%, rgba(9, 9, 11, 0) 100%);"
    bind:clientHeight={formHeight}
  >
    <slot name="footer" />

    <form
      class="flex w-full flex-shrink-0 items-end px-6 py-4"
      on:submit|preventDefault={() => {
        dispatch('submit', query);
        query = '';
      }}
    >
      <TextAreaField
        placeholder={$_('conversation.messageInput.placeholder')}
        labelClass="flex-1 flex justify-end"
        class="w-full p-3 pr-10"
        style="min-height: 24px; max-height: 256px;"
        maxlength={3000}
        rows={1}
        autofocus
        bind:value={query}
        on:input={(e) => {
          e.target.style.height = 0;
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        on:keydown={(e) => {
          if (loading || submitDisabled) return;

          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            dispatch('submit', query);
            query = '';
          }
        }}
      >
        <div
          slot="maxlength"
          class="text-content-tertiary mono-small absolute bottom-2 right-10 p-1 opacity-50"
        >
          {query?.length || 0}/{3000}
        </div>
      </TextAreaField>

      <button
        type="submit"
        class="text-content-tertiary hover:text-content-primary absolute bottom-5 right-8 cursor-pointer rounded-full p-2"
        disabled={loading || submitDisabled || !query}
      >
        <SendIcon class="h-4 w-4" />
      </button>
    </form>
  </div>
</section>
