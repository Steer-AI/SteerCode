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
  import {
    BACKEND_URL,
    USER_COOKIE_ID_NAME
  } from '$lib/shared/utils/constants';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from './Wrapper.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { Log } from '$lib/core/services/logging';
  import Cookies from 'js-cookie';
  import { getUIDHeader } from '$lib/core/services/request';

  export let agent: Conversation;
  let loading: boolean = false;
  let answer: string = '';
  let wrapContainer: ConversationWrapper;
  let eventSource: SSE | null = null;

  async function handleSubmit(query: string) {
    trackEvent('New message', {
      message: query,
      conversationId: agent.value.id
    });
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

    eventSource.addEventListener('error', (e) => handleError(e));

    eventSource.addEventListener('message', (e) => {
      scrollToBottom();
      try {
        loading = false;

        const completionResponse = JSON.parse(e.data);
        const content = completionResponse.msg;

        if (completionResponse.done) {
          agent.addMessage(
            { role: 'assistant', content: answer },
            completionResponse.id
          );
          answer = '';
          closeEventSource();
          return;
        }

        if (content) {
          answer = (answer ?? '') + content;
        }
      } catch (err) {
        handleError(err);
      }
    });
    eventSource.addEventListener;
    eventSource.stream();
    scrollToBottom();
  }

  function closeEventSource() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  function scrollToBottom(force: boolean = false) {
    if (wrapContainer) {
      wrapContainer.scrollToBottom(force);
    }
  }

  function handleError<T = any>(err: T) {
    loading = false;
    answer = '';
    let msg = $_('notifications.chatAPIError');
    Log.ERROR('ERROR getting stream response', err);
    try {
      const errMessage = JSON.parse(err.data);
      msg = errMessage.error;
    } catch (err) {
      console.error(err);
    }
    notificationStore.addNotification({
      type: NotificationType.GeneralError,
      position: Position.BottomRight,
      removeAfter: 10_000, // 10s
      message: msg
    });

    Sentry.captureException(err);
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
          closeEventSource();
          agent.addMessage({ role: 'assistant', content: answer });
          answer = '';
        }}
      >
        {$_('conversation.stop')}
      </Button>
    {/if}
  </svelte:fragment>
</ConversationWrapper>
