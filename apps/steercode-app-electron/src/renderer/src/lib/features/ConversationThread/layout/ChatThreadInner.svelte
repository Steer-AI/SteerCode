<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { onDestroy, onMount } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { get } from 'svelte/store';
  import { trackEvent } from '$lib/core/services/tracking';
  import * as Sentry from '@sentry/svelte';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from './Wrapper.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { Log } from '$lib/core/services/logging';
  import {
    getAuthUIDHeader,
    getBackendUrl,
    getUIDHeader
  } from '$lib/core/services/request';
  import type {
    ChatMessageDTO,
    ChatMode
  } from '$lib/models/types/conversation.type';
  import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';
  import type { IFileContentItem } from 'cognitic-models';

  import {
    initialFileTreeFile,
    selectedRepositoryStore
  } from '$lib/shared/stores/selectedRepository';
  import { openModal } from '$lib/features/SubscribeModal/layout/SubscribeModal.svelte';

  export let conversation: Conversation;
  let loading: boolean = false;
  let answer: string = '';
  let wrapContainer: ConversationWrapper;
  let streamController: AbortController;
  let chatModeValue: ChatMode;
  let techStackValue: string;

  type CompletionResponse = {
    msg: string;
    error: boolean;
    done?: boolean;
    id?: string;
  };

  async function handleSubmit(query: string) {
    closeEventSource();
    trackEvent('New message', {
      message: query,
      conversationId: conversation.value.id,
      chatMode: chatModeValue
    });
    answer = '';
    loading = true;
    const settings = get(settingsStore);
    streamController = new AbortController();
    const signal = streamController.signal;

    // Prepare the request options
    const headers: Record<string, string> = {};
    headers['Content-Type'] = 'application/json';
    headers['X-UID'] = getUIDHeader();
    headers['X-AUTH-UID'] = getAuthUIDHeader();
    headers['Accept'] = 'text/event-stream';

    // update header options
    const vst = window.localStorage.getItem('X_VECTOR_STORE_TYPE');
    if (vst) {
      headers['x-vector-store-type'] = vst;
    }
    if (settings.openaiAPIKey) {
      headers['x-openai-api-key'] = settings.openaiAPIKey;
    }
    const llm = window.localStorage.getItem('X_LLM_TYPE');
    if (llm) {
      headers['x-llm-type'] = llm;
    }
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
      ...conversation.value,
      documents: documents,
      root_directory: $initialFileTreeFile,
      technology_description: techStackValue,
      chat_mode: chatModeValue
    };

    async function stream(url: string, body: any) {
      await fetchEventSource(url, {
        openWhenHidden: true,
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
        async onopen(res) {
          if (res.status === 429) {
            openModal();
            throw new Error('Rate limit exceeded');
          }
        },
        onmessage(event) {
          onMessage(event);
        },
        onclose() {
          closeEventSource();
        },
        onerror(err) {
          handleError(err);
          throw err;
        },
        signal: signal
      });
    }

    // Initialize the event stream with the URL and the data you want to post
    try {
      await stream(getBackendUrl() + '/chat/stream', body);
    } catch {
      // Do nothing
    }
  }

  function onMessage(e) {
    scrollToBottom();
    try {
      loading = false;
      const completionResponse = JSON.parse(e.data) as CompletionResponse;
      const content = completionResponse.msg;

      if (completionResponse.done) {
        if (completionResponse.id) {
          conversation.addMessage(
            { role: 'assistant', content: content },
            completionResponse.id
          );
        }
        return;
      }

      if (completionResponse.error) {
        throw new Error(content);
      }

      if (content) {
        answer = (answer ?? '') + content;
      }
    } catch (err) {
      handleError(err);
    }
  }

  function closeEventSource() {
    streamController?.abort();
    answer = '';
    loading = false;
  }

  function scrollToBottom(force: boolean = false) {
    if (wrapContainer) {
      wrapContainer.scrollToBottom(force);
    }
  }

  function handleError(error: any) {
    loading = false;
    let msg = $_('notifications.chatAPIError');
    if (error instanceof Error) {
      // Handle message processing errors
      Log.ERROR('Message processing error', error);
      msg = error.message;
    } else {
      Log.ERROR('Unknown error event', error);
      try {
        const errMessage = JSON.parse(error.data);
        msg = errMessage.detail;
      } catch {
        // Do nothing
        Log.ERROR('Unknown error', error);
      }
    }

    closeEventSource();
    notificationStore.addNotification({
      type: NotificationType.GeneralError,
      position: Position.BottomRight,
      message: msg
    });
    Sentry.captureMessage(msg);
  }

  function handleEdit(
    e: CustomEvent<{ message: ChatMessageDTO; content: string }>
  ) {
    const { message, content } = e.detail;
    const index = conversation.value.messages.findIndex(
      (m) => m.id === message.id
    );
    if (index === -1) {
      return;
    }

    const messagesToDelete = [];
    for (let i = index; i < conversation.value.messages.length; i++) {
      messagesToDelete.push(conversation.value.messages[i]);
    }
    for (const m of messagesToDelete) {
      conversation.deleteMessage(m);
    }

    conversation.addMessage({ role: message.role, content }, message.id);
    handleSubmit(content);
    trackEvent('Edit message', {
      messageId: message.id,
      message: message.content,
      conversationId: conversation.value.id,
      messageIndex: index,
      deletedMessageCount: messagesToDelete.length
    });
  }

  onMount(async () => {
    selectedRepositoryStore.set(conversation.value.repository);

    let m = conversation.value.messages;
    if (m.length > 0 && m[m.length - 1].role === 'user') {
      handleSubmit(m[m.length - 1].content);
    } else {
      scrollToBottom(true);
    }
  });

  onDestroy(() => {
    closeEventSource();
  });
</script>

<ConversationWrapper
  bind:chatModeValue
  bind:techStackValue
  on:submit={(e) => {
    conversation.addMessage({ role: 'user', content: e.detail });
    handleSubmit(e.detail.query, e.detail.chatMode);
  }}
  on:feedback={(e) => {
    const { message, feedback } = e.detail;
    conversation.addFeedback(message, feedback);
    trackEvent('Feedback message', {
      messageId: message.id,
      conversationId: conversation.value.id,
      feedback: e.detail
    });
  }}
  on:deleteMessage={(e) => {
    const message = e.detail;
    conversation.deleteMessage(message);
    trackEvent('Delete message', {
      from: message.role,
      message: message.content,
      conversationId: conversation.value.id
    });
  }}
  on:edit={handleEdit}
  {loading}
  submitDisabled={answer !== ''}
  bind:this={wrapContainer}
  messages={$conversation.messages}
>
  <svelte:fragment>
    {#if answer}
      <ChatMessage type="system" message={answer} />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="footer">
    {#if answer}
      <Button
        class="bg-background-primary mx-auto"
        variant="tertiary"
        type="button"
        on:click={() => {
          conversation.addMessage({ role: 'assistant', content: answer });
          closeEventSource();
        }}
      >
        {$_('conversation.stop')}
      </Button>
    {/if}
  </svelte:fragment>
</ConversationWrapper>
