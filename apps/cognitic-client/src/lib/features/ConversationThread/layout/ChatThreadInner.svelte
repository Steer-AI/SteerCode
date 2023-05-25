<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { onDestroy, onMount } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { SSE, type SSEOptions } from 'sse.js';
  import { get } from 'svelte/store';
  import { trackEvent } from '$lib/core/services/tracking';
  import * as Sentry from '@sentry/svelte';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from './Wrapper.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { Log } from '$lib/core/services/logging';
  import { getBackendUrl, getUIDHeader } from '$lib/core/services/request';
  import type { ChatMessageDTO } from '$lib/models/types/conversation.type';
  import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';
  import type { IFileContentItem } from 'cognitic-models';

  export let conversation: Conversation;
  let loading: boolean = false;
  let answer: string = '';
  let wrapContainer: ConversationWrapper;
  let eventSource: SSE | null = null;

  type CompletionResponse = {
    msg: string;
    error: boolean;
    done?: boolean;
    id?: string;
  };

  async function handleSubmit(query: string) {
    trackEvent('New message', {
      message: query,
      conversationId: conversation.value.id
    });
    answer = '';
    loading = true;
    const settings = get(settingsStore);

    // Prepare the request options
    const headers: Record<string, string> = {};
    headers['Content-Type'] = 'application/json';
    headers['X-UID'] = getUIDHeader();

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
    // ------------------------------
    // Mocking vvvvv
    // const selections = [
    //   {
    //     fileName: 'example_1.txt',
    //     filePath: '/path/to/example_1.txt',
    //     isDirectory: false,
    //     children: []
    //   },
    //   {
    //     fileName: 'example_2.txt',
    //     filePath: '/path/to/example_2.txt',
    //     isDirectory: false,
    //     children: []
    //   }
    // ];

    // TODO - fetch contents from api
    // const contents = selections.map((selection) => {
    //   return {
    //     filePath: selection.filePath,
    //     fileName: selection.fileName,
    //     fileContent: `This is the content of ${selection.fileName}`
    //   };
    // });

    // Mocking ^^^^^
    // ------------------------------

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

    const sseOptions: SSEOptions = {
      headers: headers,
      payload: JSON.stringify({ ...conversation.value, documents: documents })
    };
    eventSource = new SSE(getBackendUrl('v2') + '/chat/stream', sseOptions);

    eventSource.addEventListener('error', (e) => handleError(e));

    eventSource.addEventListener('message', (e) => {
      scrollToBottom();
      try {
        loading = false;
        const completionResponse = JSON.parse(e.data) as CompletionResponse;
        console.log({ completionResponse });
        const content = completionResponse.msg;

        if (completionResponse.done) {
          if (completionResponse.id) {
            conversation.addMessage(
              { role: 'assistant', content: answer },
              completionResponse.id
            );
          }
          closeEventSource();
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
    });
    eventSource.stream();
    scrollToBottom();
  }

  function closeEventSource() {
    if (eventSource) {
      setTimeout(() => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
      }, 0);
      answer = '';
    }
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
    settingsStore.updateSettings({
      selectedRepo: conversation.value.repository
    });

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
  on:submit={(e) => {
    conversation.addMessage({ role: 'user', content: e.detail });
    handleSubmit(e.detail);
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
        class="mx-auto mb-2"
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
