<script lang="ts">
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { createEventDispatcher } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { _ } from 'svelte-i18n';
  import SendIcon from '$lib/shared/components/Icons/SendIcon.svelte';
  import VirtualScroll from 'svelte-virtual-scroll-list';
  import type { ChatMessageDTO } from '$lib/models/types/conversation.type';
  import { browser } from '$app/environment';

  export let loading: boolean = false;
  export let submitDisabled: boolean = false;
  export let messages: ChatMessageDTO[] = [];

  let currentScrollTimeoutRef: ReturnType<typeof setTimeout> | null = null;
  export function scrollToBottom(force: boolean = false) {
    // we used flex-direction: column-reverse to show the messages in reverse order thus scrollTop is negative
    if (currentScrollTimeoutRef) return;

    const offsetDiff =
      scrollToDiv.offsetTop - list.getOffset() - list.getClientSize();
    if (offsetDiff < 100 || force) {
      currentScrollTimeoutRef = setTimeout(() => {
        list.scrollToBottom();
        currentScrollTimeoutRef = null;
      }, 100);
    }
  }

  const dispatch = createEventDispatcher();

  let scrollToDiv: HTMLDivElement;
  let chatAreaDiv: HTMLDivElement;

  let query: string = '';

  let list: VirtualScroll;
</script>

<section class="flex h-full w-full flex-col items-center">
  <slot name="title" />

  <div
    class="relative flex w-full flex-1 flex-col-reverse gap-4 overflow-y-auto"
    bind:this={chatAreaDiv}
  >
    <slot name="footer" />

    <div role="separator" class="flex-1" />
    {#if browser}
      <VirtualScroll bind:this={list} data={messages} key="id" let:data>
        <ChatMessage
          type={data.role}
          message={data.content}
          messageFeedback={data.user_feedback}
          on:delete={() => {
            dispatch('deleteMessage', data);
          }}
          deletable={false}
          editable={data.role === 'user'}
          on:feedback={(e) => {
            dispatch('feedback', { message: data, feedback: e.detail });
          }}
          on:edit={(e) => {
            dispatch('edit', { message: data, content: e.detail });
          }}
        />
        <div slot="footer">
          <slot />
          {#if loading}
            <ChatMessage
              type="system"
              message={$_('conversation.message.loading')}
            />
          {/if}
          <div class="" bind:this={scrollToDiv} />
        </div>
      </VirtualScroll>
    {/if}
  </div>

  <form
    class="relative flex w-full max-w-5xl flex-shrink-0 items-end px-6"
    on:submit|preventDefault={() => {
      dispatch('submit', query);
      query = '';
    }}
  >
    <TextAreaField
      placeholder={$_('conversation.messageInput.placeholder')}
      labelClass="flex-1 flex justify-end"
      class="w-full p-3 pr-10"
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
        class="text-content-tertiary mono-small absolute bottom-2 right-10 p-1 opacity-50"
      >
        {query?.length || 0}/{3000}
      </div>
    </TextAreaField>

    <button
      type="submit"
      class="text-content-tertiary hover:text-content-primary absolute bottom-2 right-8 cursor-pointer rounded-full p-2"
      disabled={loading || submitDisabled || !query}
    >
      <SendIcon class="h-4 w-4" />
    </button>
  </form>
  <div
    class="text-content-secondary body-small my-6 flex max-w-5xl flex-shrink-0 items-center px-6"
  >
    {$_('conversation.disclaimer')}
  </div>
</section>
