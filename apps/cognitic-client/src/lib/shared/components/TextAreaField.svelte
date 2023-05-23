<script context="module">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  export let value: string | undefined = undefined;
  export let labelClass = 'flex items-center';
  export let eltId = 'textArea_' + counter++;
  export let maxlength: number | undefined = undefined;
  export let autofocus: boolean = false;

  export function focus() {
    inputEl.focus();
  }

  let inputEl: HTMLTextAreaElement;

  onMount(() => {
    if (autofocus && inputEl) {
      inputEl.focus();
    }
  });
</script>

<label class="ta-wrap relative {labelClass}" for={eltId}>
  <slot name="label" />

  <textarea
    id={eltId}
    bind:this={inputEl}
    {...$$restProps}
    {maxlength}
    bind:value
    on:blur
    on:focus
    on:change
    on:input
    on:keydown
    on:keyup
    on:invalid
    on:submit
  />

  <slot name="maxlength">
    {#if maxlength}
      <div class="text-content-tertiary mono-small absolute bottom-2 right-2">
        {value?.length || 0}/{maxlength}
      </div>
    {/if}
  </slot>
</label>

<style lang="postcss">
  .ta-wrap textarea {
    @apply border-stroke-primary bg-background-secondary hover:enabled:bg-background-secondaryActive text-content-primary placeholder:text-content-tertiary focus:border-b-primary caret-primary resize-none appearance-none border-b text-left outline-none ring-0 ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50;
  }
</style>
