<script lang="ts">
  import CloseIcon from '../components/Icons/CloseIcon.svelte';

  export let dialogEl: HTMLDialogElement;
  export let withCloseButton: boolean = true;
  export let closeOnEsc: boolean = true;
  export let closeOnBackdropClick: boolean = true;

  function handleEscKeyPress(e: KeyboardEvent) {
    if (!closeOnEsc) return;
    if (e.key !== 'Escape') return;

    e.preventDefault();
    dialogEl.close();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (!closeOnBackdropClick) return;
    // if clicked outside <dialog> element, return
    const rect = dialogEl.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (isInDialog) return;

    e.preventDefault();
    dialogEl.close();
  }
</script>

<svelte:window on:keyup={handleEscKeyPress} />

<dialog
  bind:this={dialogEl}
  on:close
  on:click={handleBackdropClick}
  class={$$props.class}
  style={$$props.style}
>
  {#if withCloseButton}
    <button
      class="absolute"
      style="top: 26px; right: 24px"
      on:click={() => dialogEl.close()}
    >
      <CloseIcon
        class="text-content-secondary hover:text-content-primary h-4 w-4"
      />
    </button>
  {/if}

  <slot name="title">
    <h1 class="headline-small text-content-primary">Dialog Title</h1>
  </slot>
  <slot name="description">
    <p class="body-redular text-content-secondary mt-3">Dialog desrciption</p>
  </slot>
  <slot name="action">
    <button class="body-small-plus uppercase" on:click={() => dialogEl.close()}>
      Close
    </button>
  </slot>
  <slot />
</dialog>

<style lang="postcss">
  dialog {
    max-height: 90vh;
    max-height: 90dvh;
    @apply bg-background-secondary p-6;
  }
  dialog::backdrop {
    @apply bg-background-primary bg-opacity-40;
  }
</style>
