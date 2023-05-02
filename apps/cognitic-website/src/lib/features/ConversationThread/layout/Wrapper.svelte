<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import SearchIcon from '$lib/shared/components/Icons/SearchIcon.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { onMount } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { SSE } from 'sse.js';
  import { get } from 'svelte/store';
  import { trackEvent, trackPage } from '$lib/core/services/tracking';
  import * as Sentry from '@sentry/svelte';
  import { BACKEND_CHAT_URL } from '$lib/shared/utils/constants';

  export let agent: Conversation;

  let query: string = '';
  let answer: string = '';
  let loading: boolean = false;
  let scrollToDiv: HTMLDivElement;

  function scrollToBottom() {
    setTimeout(function () {
      scrollToDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }, 100);
  }

  const handleSubmit = async () => {
    trackEvent('New message', {
      message: query,
      conversationId: agent.value.id
    });

    loading = true;
    agent.addMessage({ role: 'user', content: query });

    const settings = get(settingsStore);

    const eventSource = new SSE(BACKEND_CHAT_URL, {
      headers: {
        'Content-Type': 'application/json',
        'x-openai-api-key': settings.openaiAPIKey || '',
        'x-openai-model': settings.openaiModel,
        'x-openai-temperature': settings.temperature.toString()
      },
      payload: JSON.stringify({
        conversation_id: agent.value.id,
        messages: agent.value.messages,
        system_prompt: agent.value.system_prompt
      })
    });

    query = '';

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
        console.log({ completionResponse });
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
  };

  function handleError<T = any>(err: T) {
    loading = false;
    query = '';
    answer = '';
    let msg = 'An error occurred while processing your request.';
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

  onMount(() => {
    trackPage('Conversation', { conversationId: agent.value.id });
    scrollToBottom();
  });
</script>

<section class="flex h-full w-full flex-col items-center">
  <div class="flex h-14 w-full items-center justify-between px-6">
    <h3 class="text-content-secondary headline-small" />

    <Button
      variant="tertiary"
      size="medium"
      disabled={$agent.messages.length === 0}
      on:click={() => {
        agent.deleteAllMessages();
        trackEvent('Clear chat', { conversationId: agent.value.id });
      }}
    >
      Clear Chat
    </Button>
  </div>
  <Divider class="w-full" />

  <div class="mt-4 flex w-full flex-1 flex-col gap-4 overflow-y-auto px-6">
    <div class="flex flex-col gap-2">
      {#if $agent.system_prompt}
        <ChatMessage
          senderName={agent.value.name}
          type="assistant"
          message="I will use the following prompt: {$agent.system_prompt}"
        />
      {/if}
      <ChatMessage
        senderName={agent.value.name}
        type="assistant"
        message="Hello, ask me anything you want!"
      />

      {#each $agent.messages as message, i}
        <ChatMessage
          senderName={message.role === 'user' ? 'Me' : agent.value.name}
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
          senderName={agent.value.name}
          type="assistant"
          message={answer}
        />
      {/if}
      {#if loading}
        <ChatMessage
          senderName={agent.value.name}
          type="assistant"
          message="Loading.."
        />
      {/if}
    </div>
    <div class="" bind:this={scrollToDiv} />
  </div>

  <form
    class="flex w-full flex-shrink-0 items-end gap-4 px-6 py-2"
    on:submit|preventDefault={handleSubmit}
  >
    <TextAreaField
      placeholder="Enter your question..."
      labelClass="flex-1 flex justify-end"
      class="w-full p-3"
      style="min-height: 24px; max-height: 256px;"
      maxlength={2000}
      rows={1}
      bind:value={query}
      on:input={(e) => {
        e.target.style.height = 0;
        e.target.style.height = e.target.scrollHeight + 'px';
      }}
      on:keydown={(e) => {
        if (loading || answer) return;

        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }}
    />

    <Button
      variant="primary"
      type="submit"
      size="medium"
      class="w-24"
      disabled={loading || answer === ''}
    >
      <SearchIcon class="mr-2 h-4 w-4" />
      Send
    </Button>
  </form>
</section>
