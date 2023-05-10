<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import DoneIcon from './Icons/DoneIcon.svelte';
  import IntermediateCheckboxIcon from './Icons/IntermediateCheckboxIcon.svelte';

  export let checked = false;
  export let intermediate = false;
  export let disabled = false;
  export let variant: 'primary' | 'secondary' = 'primary';
  export let checkboxClass: string = '';

  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    dispatch('click', {
      original: event,
      checked: (event.currentTarget as HTMLInputElement).checked as boolean
    });
  }
</script>

<label on:click={handleClick} style={$$props.style} class={$$props.class}>
  <slot name="before" />
  <div class="checkbox-container {variant} {checkboxClass}">
    <input type="checkbox" bind:checked {disabled} />
    <span
      class="
      checkmark flex items-center justify-center
      {variant}
      {variant === 'primary' && checked && !disabled
        ? 'border-primary bg-primary'
        : ''}
      {variant === 'primary' && !disabled ? 'border-primary-darker' : ''}
      {variant === 'secondary' && checked && !disabled
        ? 'bg-background-inverse'
        : ''}
      {variant === 'secondary' && !disabled ? 'border-content-primary' : ''}
      {disabled ? 'border-background-primaryDisabled' : ''}
      {checked && disabled ? 'bg-background-primaryDisabled' : ''}
    "
    >
      {#if intermediate}
        <IntermediateCheckboxIcon
          class="{checked ? 'block' : 'hidden'} text-content-inverse"
        />
      {:else}
        <DoneIcon class="{checked ? 'block' : 'hidden'} text-content-inverse" />
      {/if}
    </span>
  </div>

  <slot name="after" />
</label>

<style lang="postcss">
  @tailwind components;

  @layer components {
    /* Customize the label (the checkbox-container) */
    .checkbox-container {
      @apply relative block aspect-square;
    }
    /* Hide the browser's default checkbox */
    .checkbox-container input {
      @apply absolute h-0 w-0 opacity-0;
    }

    /* Create a custom checkbox */
    .checkmark {
      @apply absolute inset-0 cursor-pointer border;
    }

    .checkbox-container input:disabled ~ .checkmark {
      @apply cursor-not-allowed;
    }

    /* On mouse-over */
    .checkbox-container.primary:hover input:not(:disabled) ~ .checkmark {
      @apply border-primary;
    }
    .checkbox-container.secondary:hover input:not(:disabled) ~ .checkmark {
      @apply border-content-primary;
    }
    /* When the checkbox is checked, add a blue background */
    input:checked:not(:disabled) ~ .checkmark.primary {
      @apply bg-primary;
    }
    input:checked:not(:disabled) ~ .checkmark.secondary {
      @apply bg-background-inverse;
    }
  }
</style>
