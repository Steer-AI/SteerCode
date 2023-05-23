<script context="module">
  let counter = 0;
</script>

<script lang="ts">
  export let value: string | number | undefined = undefined;
  export let labelClass = 'flex items-center';
  export let eltId = 'input_' + counter++;

  export function focus() {
    inputEl.focus();
  }

  const hasPrefixIcon = $$slots['prefix-icon'] !== undefined;
  const hasSufixIcon = $$slots['sufix-icon'] !== undefined;

  let inputEl: HTMLInputElement;
</script>

<label class="input-wrapper relative {labelClass}" for={eltId}>
  <slot name="label" />
  <div class="relative w-full">
    {#if hasPrefixIcon}
      <div
        class="text-content-tertiary absolute left-2 top-1/2 flex -translate-y-1/2 items-center"
      >
        <slot name="prefix-icon" />
      </div>
    {/if}
    <input
      id={eltId}
      bind:this={inputEl}
      {...$$restProps}
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
    {#if hasSufixIcon}
      <div
        class="text-content-tertiary absolute right-2 top-1/2 flex -translate-y-1/2 items-center"
      >
        <slot name="sufix-icon" />
      </div>
    {/if}
  </div>
</label>

<style lang="postcss">
  .input-wrapper input {
    @apply border-stroke-primary bg-background-secondary hover:enabled:bg-background-secondaryActive text-content-primary placeholder:text-content-tertiary focus:border-b-primary caret-primary w-full appearance-none border-b text-left outline-none ring-0 ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50;
  }

  .input-wrapper input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
    margin: 0;
  }

  .input-wrapper input[type='number']::-webkit-inner-spin-button,
  .input-wrapper input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
