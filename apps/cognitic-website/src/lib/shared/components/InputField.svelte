<script context="module">
  let counter = 0;
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  export let value: string | null | number = '';
  export let placeholder = 'Search...';
  export let autofocus = false;
  export let labelClass = '';
  export let size: 'medium' | 'large' = 'medium';
  export let elevated: boolean = false;
  export let input: HTMLInputElement = undefined;

  export let eltId = 'input_' + counter++;

  export function focus() {
    input.focus();
  }

  onMount(() => {
    autofocus && input.focus();
  });

  const hasPrefixIcon = $$slots['prefix-icon'] !== undefined;
  const hasSufixIcon = $$slots['sufix-icon'] !== undefined;

  export let prefixIconWidth: number = 0;
  export let sufixIconWidth: number = 0;
</script>

<label class="relative block {labelClass}" for={eltId}>
  <slot name="label" />
  <div
    class="relative flex items-center"
    class:h-8={size === 'large'}
    class:h-6={size === 'medium'}
  >
    {#if hasPrefixIcon}
      <div class="icon left-2" bind:clientWidth={prefixIconWidth}>
        <slot name="prefix-icon" />
      </div>
    {/if}
    <input
      id={eltId}
      bind:this={input}
      class="h-full {$$props.class} {size} {size === 'medium'
        ? 'body-small placeholder:body-small'
        : ''} {size === 'large'
        ? 'body-regular placeholder:body-regular'
        : ''} {elevated ? 'elevated' : ''}"
      style="
        padding-left: {prefixIconWidth ? prefixIconWidth + 14 : 6}px;
        padding-right: {sufixIconWidth ? sufixIconWidth + 14 : 6}px;
      "
      {...$$props.inputProps}
      {placeholder}
      bind:value
      on:blur
      on:focus
      on:change
      on:input
      on:keydown
      on:keyup
      on:invalid
    />
    {#if hasSufixIcon}
      <div class="icon right-2" bind:clientWidth={sufixIconWidth}>
        <slot name="sufix-icon" />
      </div>
    {/if}
  </div>
</label>

<style lang="postcss">
  input {
    @apply border-background-850 bg-background-850 text-content-primary appearance-none border-b text-left disabled:cursor-not-allowed disabled:opacity-50;
  }

  input.elevated {
    @apply border-background-750 bg-background-750;
  }

  input:hover {
    @apply bg-background-850;
  }

  input.elevated:hover {
    @apply bg-background-650;
  }
  /* 
  input.medium,
  input.medium::placeholder {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
  }
  input.large,
  input.large::placeholder {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  } */
  input::placeholder {
    @apply text-content-tertiary;
  }

  /* label > div:focus-within .icon {
    @apply text-content-primary;
  } */
  .icon {
    @apply text-content-tertiary absolute top-1/2 -translate-y-1/2;
  }

  input:focus {
    @apply !border-b-primary caret-primary border-b outline-none ring-0 ring-offset-0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
    margin: 0;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
