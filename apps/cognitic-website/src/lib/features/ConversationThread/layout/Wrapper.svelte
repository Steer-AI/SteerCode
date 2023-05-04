<script lang="ts">
  import Button from '$lib/shared/components/Button.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { createEventDispatcher } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { _ } from 'svelte-i18n';
  import SendIcon from '$lib/shared/components/Icons/SendIcon.svelte';

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
  <slot name="title" />

  <div
    class="relative mt-4 flex w-full max-w-5xl flex-1 flex-col-reverse gap-4 overflow-y-auto px-6"
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
    class="relative flex w-full max-w-5xl flex-shrink-0 items-end px-6 py-2"
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
        class="text-content-tertiary mono-small bg-background-secondary absolute bottom-2 right-14 p-1"
      >
        {query?.length || 0}/{3000}
      </div>
    </TextAreaField>

    <Button
      variant="primary"
      type="submit"
      size="medium"
      class="absolute bottom-4 right-8 rounded-full"
      disabled={loading || submitDisabled}
    >
      <SendIcon class="h-4 w-4" />
    </Button>
  </form>
</section>
