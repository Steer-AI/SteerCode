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
  import Divider from '$lib/shared/components/Divider.svelte';
  import LinkIcon from '$lib/shared/components/Icons/LinkIcon.svelte';

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
        'X-UID': window.localStorage.getItem('cognitic.uid') || 'TEST'
      },
      payload: JSON.stringify({
        conversation_id: agent.value.id,
        messages: agent.value.messages,
        model: settings.openaiModel,
        temperature: settings.temperature
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
          closeEventSource();
          return;
        }

        const completionResponse = JSON.parse(e.data);
        const content = completionResponse.msg;

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
      handleSubmit(m[m.length - 1].content);
    } else {
      scrollToBottom(true);
    }
  });
</script>

<ConversationWrapper
  agentName={agent.value.title}
  on:submit={(e) => {
    agent.addMessage({ role: 'user', content: e.detail });
    handleSubmit(e.detail);
  }}
  {loading}
  submitDisabled={answer !== ''}
  bind:this={wrapContainer}
>
  <svelte:fragment slot="title">
    <div class="flex h-14 w-full max-w-5xl items-center justify-end px-6">
      <h3 class="text-content-secondary headline-small">
        {$_('conversation.chattingTitle', {
          values: { name: agent.value.repository_name }
        })}
      </h3>
      {#if agent.value.repository_url}
        <a
          href={agent.value.repository_url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-content-tertiary hover:text-content-primary ml-1"
        >
          <LinkIcon class="h-4 w-4" />
        </a>
      {/if}
    </div>
    <Divider class="w-full" />
  </svelte:fragment>

  <svelte:fragment>
    {#each $agent.messages as message (message.id)}
      <ChatMessage
        senderName={message.role === 'user'
          ? $_('conversation.message.me')
          : agent.value.title}
        type={message.role}
        message={message.content}
        on:delete={() => {
          agent.deleteMessage(message);
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
