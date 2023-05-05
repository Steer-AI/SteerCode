<script lang="ts">
  import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeRendered from './CodeRendered.svelte';
  import LogoIcon from '$lib/shared/components/Icons/LogoIcon.svelte';
  import { _ } from 'svelte-i18n';
  import CodeSpanRenderer from './CodeSpanRenderer.svelte';

  export let senderName: string;
  export let type: ChatCompletionRequestMessageRoleEnum;
  export let message: string;
  export let deletable: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
  <div class="chat-image avatar">
    <div class="group w-10 overflow-hidden rounded-full">
      {#if deletable}
        <button
          class="bg-background-primary absolute inset-0 hidden items-center justify-center bg-opacity-20 group-hover:flex"
          on:click={() => dispatch('delete')}
        >
          <BinIcon class="text-error h-6 w-6" />
        </button>
      {/if}
      {#if type === 'user'}
        <img
          src="https://ui-avatars.com/api/?name={$_(
            'conversation.message.me'
          )}Me&size=40&background=FFDC00&color=000"
          alt="{type} avatar"
        />
      {:else}
        <div
          class="bg-background-secondaryActive flex h-10 w-10 items-center justify-center"
        >
          <LogoIcon class="h-6 w-6" />
        </div>
      {/if}
    </div>
  </div>
  <div class="chat-header label-mini">
    {senderName}
  </div>
  <div
    class="prose prose-invert chat-bubble text-content-primary overflow-y-auto {type ===
    'user'
      ? 'bg-background-secondary'
      : 'bg-background-secondaryActive'}"
  >
    <SvelteMarkdown
      source={message}
      on:parsed={(x) => console.log('parsed', x)}
      renderers={{
        code: CodeRendered,
        codespan: CodeSpanRenderer
      }}
    />
  </div>
</div>

<style lang="postcss">
  /* https://highlightjs.tiddlyhost.com/ */
  @import './styles/vs2015.css';
  .chat {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 0.75rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  .chat-image {
    grid-row: span 2 / span 2;
    align-self: flex-end;
  }
  .avatar {
    position: relative;
    display: inline-flex;
  }
  .chat-start {
    place-items: start;
    grid-template-columns: auto 1fr;
  }

  .chat-end {
    place-items: end;
    grid-template-columns: 1fr auto;
  }

  .chat-bubble {
    position: relative;
    width: -moz-fit-content;
    width: fit-content;
    padding: 0.5rem 1rem;
    max-width: 90%;
    border-radius: var(--rounded-box, 1rem);
    min-height: 2.75rem;
    min-width: 2.75rem;
  }

  .chat-header {
    grid-row-start: 1;
  }

  .chat-start .chat-image {
    grid-column-start: 1;
  }

  .chat-start .chat-header,
  .chat-start .chat-footer {
    grid-column-start: 2;
  }

  .chat-start .chat-bubble {
    grid-column-start: 2;
    border-bottom-left-radius: 0;
  }

  .chat-end .chat-image {
    grid-column-start: 2;
  }
  .chat-end .chat-bubble {
    grid-column-start: 1;
    border-bottom-right-radius: 0;
  }
  .chat-end .chat-header,
  .chat-end .chat-footer {
    grid-column-start: 1;
  }
</style>
