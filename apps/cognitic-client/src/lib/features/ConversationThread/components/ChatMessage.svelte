<script lang="ts">
  import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeRendered from './CodeRendered.svelte';
  import LogoIcon from '$lib/shared/components/Icons/LogoIcon.svelte';
  import { _ } from 'svelte-i18n';
  import CodeSpanRenderer from './CodeSpanRenderer.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import ThumbsUpIcon from '$lib/shared/components/Icons/ThumbsUpIcon.svelte';
  import ThumbsDownIcon from '$lib/shared/components/Icons/ThumbsDownIcon.svelte';
  import MinusCircleIcon from '$lib/shared/components/Icons/MinusCircleIcon.svelte';
  import CreateIcon from '$lib/shared/components/Icons/CreateIcon.svelte';
  import Button from '$lib/shared/components/Button.svelte';

  export let type: ChatCompletionRequestMessageRoleEnum;
  export let message: string;
  export let deletable: boolean = false;
  export let editable: boolean = false;
  export let messageFeedback: string | null = null;

  const dispatch = createEventDispatcher();

  function animateClick(target: EventTarget | null) {
    if (target === null) {
      return;
    }
    const el = target as HTMLElement;
    el.classList.add('animate-pop');
    setTimeout(() => {
      el.classList.remove('animate-pop');
    }, 1500);
  }

  let editMode: boolean = false;
  let editMessage: string;
  let textArea: HTMLTextAreaElement;

  function handleEdit() {
    editMode = true;
    editMessage = message;
    setTimeout(() => {
      if (textArea === undefined) {
        return;
      }

      textArea.focus();
      textArea.style.height = '0';
      textArea.style.height = textArea.scrollHeight + 'px';
    }, 0);
  }
</script>

<div
  class={type === 'user'
    ? 'bg-background-primary'
    : 'bg-background-primaryHover'}
>
  <div
    class="mx-auto flex max-w-5xl flex-col items-start justify-start gap-6 p-6 md:flex-row"
  >
    <div class="group relative w-8 flex-shrink-0 overflow-hidden">
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
          )}Me&size=40&background=8B60ED&color=000"
          alt={type}
        />
      {:else}
        <div
          class="bg-background-primary flex h-8 w-8 items-center justify-center"
        >
          <LogoIcon class="h-6 w-6" />
        </div>
      {/if}
    </div>

    <div
      class="prose prose-invert text-content-primary group relative w-full flex-1 overflow-hidden"
    >
      {#if editMode}
        <textarea
          class="m-0 h-0 w-full resize-none overflow-y-hidden border-0 bg-[transparent] p-0 focus:ring-0"
          bind:value={editMessage}
          bind:this={textArea}
          on:input={(e) => {
            e.target.style.height = '0';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />

        <div class="mx-auto mt-4 flex items-center gap-4">
          <Button
            variant="primary"
            on:click={() => {
              if (editMessage !== message) {
                dispatch('edit', editMessage);
              }
              editMode = false;
            }}
          >
            {$_('conversation.saveEdit')}
          </Button>

          <Button
            variant="secondary"
            on:click={() => {
              editMessage = '';
              editMode = false;
            }}
          >
            {$_('conversation.cancelEdit')}
          </Button>
        </div>
      {:else}
        <SvelteMarkdown
          source={message}
          renderers={{
            code: CodeRendered,
            codespan: CodeSpanRenderer
          }}
        />

        <slot />
      {/if}

      {#if type === 'assistant'}
        <div
          class="bg-background-primaryActive label-small mt-6 flex h-7 !w-fit items-center gap-3 px-3"
        >
          <p class="text-content-tertiary">
            {$_('conversation.message.improveText')}
          </p>

          <button
            disabled={messageFeedback === 'positive'}
            class="{messageFeedback === 'positive'
              ? 'text-content-primary'
              : 'text-content-secondary'} hover:text-content-primary"
            on:click={(e) => {
              dispatch('feedback', 'positive');
              animateClick(e.target);
            }}
          >
            <ThumbsUpIcon class="h-3 w-3" />
          </button>
          <button
            disabled={messageFeedback === 'negative'}
            class="{messageFeedback === 'negative'
              ? 'text-content-primary'
              : 'text-content-secondary'} hover:text-content-primary"
            on:click={(e) => {
              dispatch('feedback', 'negative');
              animateClick(e.target);
            }}
          >
            <ThumbsDownIcon class="h-3 w-3" />
          </button>
          <button
            disabled={messageFeedback === 'neutral'}
            class="{messageFeedback === 'neutral'
              ? 'text-content-primary'
              : 'text-content-secondary'} hover:text-content-primary"
            on:click={(e) => {
              dispatch('feedback', 'neutral');
              animateClick(e.target);
            }}
          >
            <MinusCircleIcon class="h-3 w-3" />
          </button>
        </div>
      {/if}

      {#if editable && !editMode}
        <button
          class="absolute right-0 top-4 hidden group-hover:block"
          on:click={handleEdit}
        >
          <CreateIcon
            class="text-content-tertiary hover:text-content-primary h-4 w-4"
          />
        </button>
      {/if}
    </div>
  </div>
</div>
<Divider />

<style lang="postcss">
  /* https://highlightjs.tiddlyhost.com/ */
  @import './styles/vs2015.css';

  :global(.animate-pop) {
    transform-origin: center;
    animation: pop 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-iteration-count: 1;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.2);
    }
    40% {
      transform: scale(1.2) rotate(8deg);
    }
    60% {
      transform: scale(1.2) rotate(-8deg);
    }
    80% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
