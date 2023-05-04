<script lang="ts">
  import Button from '$lib/shared/components/Button.svelte';
  import SearchIcon from '$lib/shared/components/Icons/SearchIcon.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { createEventDispatcher } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { _ } from 'svelte-i18n';

  export let agentName: string;
  export let loading: boolean = false;
  export let submitDisabled: boolean = false;

  export function scrollToBottom(force: boolean = false) {
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

  const dispatch = createEventDispatcher();

  let scrollToDiv: HTMLDivElement;
  let chatAreaDiv: HTMLDivElement;

  let query: string = '';
</script>

<section class="flex h-full w-full flex-col items-center">
  <div
    class="relative mt-4 flex w-full flex-1 flex-col-reverse gap-4 overflow-y-auto px-6"
    bind:this={chatAreaDiv}
  >
    <div class="" bind:this={scrollToDiv} />
    <slot name="footer" />

    <div class="flex flex-col gap-2">
      <ChatMessage
        senderName={agentName}
        type="assistant"
        message={$_('conversation.message.initialMessage')}
      />

      <slot />
      {#if loading}
        <ChatMessage
          senderName={agentName}
          type="assistant"
          message={$_('conversation.message.loading')}
        />
      {/if}
    </div>
  </div>

  <form
    class="flex w-full flex-shrink-0 items-end gap-4 px-6 py-2"
    on:submit|preventDefault={() => {
      dispatch('submit', query);
      query = '';
    }}
  >
    <TextAreaField
      placeholder={$_('conversation.messageInput.placeholder')}
      labelClass="flex-1 flex justify-end"
      class="w-full p-3"
      style="min-height: 24px; max-height: 256px;"
      maxlength={3000}
      rows={1}
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
    />

    <Button
      variant="primary"
      type="submit"
      size="medium"
      class="w-24"
      disabled={loading || submitDisabled}
    >
      <SearchIcon class="mr-2 h-4 w-4" />
      {$_('conversation.sendButton')}
    </Button>
  </form>
</section>
