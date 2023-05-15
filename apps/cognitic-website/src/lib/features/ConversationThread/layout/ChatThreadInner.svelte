<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { onMount } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { SSE } from 'sse.js';
  import { get } from 'svelte/store';
  import { trackEvent } from '$lib/core/services/tracking';
  import * as Sentry from '@sentry/svelte';
  import { BACKEND_URL } from '$lib/shared/utils/constants';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from './Wrapper.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { Log } from '$lib/core/services/logging';
  import { getUIDHeader } from '$lib/core/services/request';

  export let agent: Conversation;
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
      conversationId: agent.value.id
    });
    answer = '';
    loading = true;
    const settings = get(settingsStore);

    eventSource = new SSE(BACKEND_URL + '/chat/stream', {
      headers: {
        'Content-Type': 'application/json',
        'x-openai-api-key': settings.openaiAPIKey || '',
        'X-UID': getUIDHeader()
      },
      payload: JSON.stringify(agent.value)
    });

    eventSource.addEventListener('status', (e) => {
      Log.DEBUG('System status is now: ' + e.data);
    });
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
            agent.addMessage(
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
      eventSource.close();
      eventSource = null;
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
    if (error instanceof Event) {
      // Handle SSE connection errors
      if (error.source!.readyState === EventSource.CLOSED) {
        Log.ERROR('SSE connection closed');
      } else if (error.source!.readyState === EventSource.CONNECTING) {
        Log.ERROR('SSE connection reconnecting');
      } else {
        Log.ERROR('SSE connection error', error);
      }
    } else if (error instanceof Error) {
      // Handle message processing errors
      Log.ERROR('Message processing error', error);
      msg = error.message;
    } else {
      Log.ERROR('Unknown error', error);
      try {
        const errMessage = JSON.parse(error.data);
        msg = errMessage.error;
      } catch {
        // Do nothing
        Log.ERROR('Unknown error', error);
      }
    }

    closeEventSource();
    notificationStore.addNotification({
      type: NotificationType.GeneralError,
      position: Position.BottomRight,
      removeAfter: 10_000, // 10s
      message: msg
    });
    Sentry.captureMessage(msg);
  }

  onMount(async () => {
    let m = agent.value.messages;
    if (m.length > 0 && m[m.length - 1].role === 'user') {
      handleSubmit(m[m.length - 1].content);
    } else {
      scrollToBottom(true);
    }
  });
</script>

<ConversationWrapper
  on:submit={(e) => {
    agent.addMessage({ role: 'user', content: e.detail });
    handleSubmit(e.detail);
  }}
  {loading}
  submitDisabled={answer !== ''}
  bind:this={wrapContainer}
>
  <svelte:fragment>
    {#each $agent.messages as message (message.id)}
      <ChatMessage
        type={message.role}
        message={message.content}
        messageFeedback={message.user_feedback}
        on:delete={() => {
          agent.deleteMessage(message);
          trackEvent('Delete message', {
            from: message.role,
            message: message.content,
            conversationId: agent.value.id
          });
        }}
        deletable={false}
        on:feedback={(e) => {
          agent.addFeedback(message, e.detail);
          trackEvent('Feedback message', {
            messageId: message.id,
            conversationId: agent.value.id,
            feedback: e.detail
          });
        }}
      />
    {/each}
    {#if answer}
      <ChatMessage type="system" message={answer} />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="footer">
    {#if answer}
      <Button
        class="mx-auto"
        variant="tertiary"
        type="button"
        on:click={() => {
          agent.addMessage({ role: 'assistant', content: answer });
          closeEventSource();
        }}
      >
        {$_('conversation.stop')}
      </Button>
    {/if}
  </svelte:fragment>
</ConversationWrapper>
