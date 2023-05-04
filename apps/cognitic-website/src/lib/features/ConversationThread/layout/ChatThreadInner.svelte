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

  export let agent: Conversation;
  let loading: boolean = false;
  let answer: string = '';
  let scrollToDiv: HTMLDivElement;
  let chatAreaDiv: HTMLDivElement;

  async function handleSubmit(query: string, insertMessage: boolean = true) {
    trackEvent('New message', {
      message: query,
      conversationId: agent.value.id
    });

    loading = true;
    if (insertMessage) agent.addMessage({ role: 'user', content: query });

    const settings = get(settingsStore);

    const eventSource = new SSE(BACKEND_URL + '/chat/stream', {
      headers: {
        'Content-Type': 'application/json',
        'x-openai-api-key': settings.openaiAPIKey || '',
        'x-openai-model': settings.openaiModel,
        'x-openai-temperature': settings.temperature.toString(),
        'X-UID': window.localStorage.getItem('cognitic.uid') || 'TEST'
      },
      payload: JSON.stringify({
        conversation_id: agent.value.id,
        messages: agent.value.messages
      })
    });

    eventSource.addEventListener('error', (e) => handleError(e));

    eventSource.addEventListener('message', (e) => {
      scrollToBottom();
      try {
        loading = false;
        if (e.data === '[DONE]') {
          agent.addMessage({ role: 'assistant', content: answer });
          answer = '';
          return;
        }

        const completionResponse = JSON.parse(e.data);
        console.log('completionResponse', completionResponse);
        const content =
          completionResponse.msg || completionResponse.choices[0].delta.content;

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

  function scrollToBottom(force: boolean = false) {
    if (!scrollToDiv || !chatAreaDiv) return;
    // we used flex-direction: column-reverse to show the messages in reverse order thus scrollTop is negative
    if (chatAreaDiv.scrollTop > -200 || force) {
      setTimeout(function () {
        scrollToDiv.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }

  function handleError<T = any>(err: T) {
    loading = false;
    answer = '';
    let msg = $_('notifications.chatAPIError');
    console.log('err', err);
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
      handleSubmit('', false);
    } else {
      scrollToBottom(true);
    }
  });
</script>

<ConversationWrapper
  agentName={agent.value.title}
  on:submit={(e) => handleSubmit(e.detail)}
  {loading}
  submitDisabled={answer !== ''}
>
  {#each $agent.messages as message, i (message.created_at)}
    <ChatMessage
      senderName={message.role === 'user'
        ? $_('conversation.message.me')
        : agent.value.title}
      type={message.role}
      message={message.content}
      on:delete={() => {
        agent.deleteMessageByIndex(i);
        trackEvent('Delete message', {
          from: message.role,
          message: message.content,
          conversationId: agent.value.id
        });
      }}
      deletable={true}
    />
  {/each}
  {#if answer}
    <ChatMessage
      senderName={agent.value.title}
      type="assistant"
      message={answer}
    />
  {/if}
</ConversationWrapper>
