<script lang="ts">
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import Button from '$lib/shared/components/Button.svelte';
  import SearchIcon from '$lib/shared/components/Icons/SearchIcon.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { SSE } from 'sse.js';
  import { get } from 'svelte/store';

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
    loading = true;
    agent.addMessage({ role: 'user', content: query });

    const settings = get(settingsStore);

    const eventSource = new SSE('/api/chat', {
      headers: {
        'Content-Type': 'application/json',
        'x-openai-api-key': settings.openaiAPIKey || '',
        'x-openai-model': settings.openaiModel,
        'x-openai-temperature': settings.temperature.toString()
      },
      payload: JSON.stringify({
        messages: agent.value.messages,
        system_prompt: agent.value.system_prompt
      })
    });

    query = '';

    eventSource.addEventListener('error', handleError);

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
        const [{ delta }] = completionResponse.choices;

        if (delta.content) {
          answer = (answer ?? '') + delta.content;
        }
      } catch (err) {
        handleError(err);
      }
    });
    eventSource.stream();
    scrollToBottom();
  };

  function handleError<T>(err: T) {
    loading = false;
    query = '';
    answer = '';
    console.error(err);
  }
</script>

<section class="flex h-full w-full flex-col items-center pt-4">
  <div class="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-6">
    <div class="flex flex-col gap-2">
      {#if $agent.system_prompt}
        <ChatMessage
          type="assistant"
          message="I will use the following prompt: {$agent.system_prompt}"
        />
      {/if}
      <ChatMessage
        type="assistant"
        message="Hello, ask me anything you want!"
      />

      {#each $agent.messages as message}
        <ChatMessage type={message.role} message={message.content} />
      {/each}
      {#if answer}
        <ChatMessage type="assistant" message={answer} />
      {/if}
      {#if loading}
        <ChatMessage type="assistant" message="Loading.." />
      {/if}
    </div>
    <div class="" bind:this={scrollToDiv} />
  </div>

  <form
    class="flex w-full flex-shrink-0 items-end gap-4 px-6 py-2"
    on:submit|preventDefault={() => handleSubmit()}
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
        if (e.key === 'Enter' && !e.shiftKey) {
          handleSubmit();
        }
      }}
    />

    <Button
      variant="primary"
      type="submit"
      size="medium"
      class="w-24"
      disabled={loading}
    >
      <SearchIcon class="mr-2 h-4 w-4" />
      Send
    </Button>
  </form>
</section>
