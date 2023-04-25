<script lang="ts">
  export let disabled = false;
  export let as: string = 'button';
  export let size: 'small' | 'medium' | 'large' | 'custom' = 'small';
  export let textSize: 'small' | 'large' = 'small';
  export let variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  function remainingProps() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, size, variant, ...rest } = $$props;
    delete rest.class;
    return rest;
  }
</script>

<svelte:element
  this={as}
  on:click
  class:cursor-not-allowed={disabled}
  class:body-small-plus={textSize === 'small'}
  class:body-regular-plus={textSize === 'large'}
  class={`box-border flex items-center justify-center uppercase
    ${variant}
    ${size}
    ${$$props.class}
  `}
  {...remainingProps()}
>
  <slot>Button</slot>
</svelte:element>

<style lang="postcss">
  .secondary,
  .tertiary,
  .error {
    @apply border;
  }

  .primary:not(:disabled) {
    @apply bg-primary text-content-inverse hover:bg-primary-lighter;
  }
  .primary:disabled {
    @apply bg-background-primaryDisabled text-background-primary;
  }
  .secondary:not(:disabled) {
    @apply border-primary text-content-primary hover:bg-primary-lighter hover:text-content-inverse;
  }
  .secondary:disabled {
    @apply border-stroke-secondary text-content-secondary;
  }
  .tertiary:not(:disabled) {
    @apply border-stroke-secondary text-content-primarySub hover:border-content-primarySub;
  }
  .tertiary:disabled {
    @apply border-stroke-secondary text-content-tertiary;
  }
  .error:not(:disabled) {
    @apply bg-error text-content-inverse hover:bg-error-lighter;
  }
  .error:disabled {
    @apply border-error bg-error text-content-inverse opacity-40;
  }

  .small {
    @apply h-6 px-2 py-1;
  }
  .medium {
    @apply h-8 px-2 py-1;
  }
  .large {
    @apply h-12 px-3 py-2;
  }
</style>
