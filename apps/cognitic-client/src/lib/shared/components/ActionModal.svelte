<script lang="ts">
  import Button from './Button.svelte';
  import Dialog from '../layout/Dialog.svelte';

  export let title: string;
  export let description: string;
  export let confirmText: string = 'Confirm';
  export let cancelText: string = 'Cancel';
  export let dialogEl: HTMLDialogElement;
</script>

<Dialog
  bind:dialogEl
  on:close
  class={$$props.class}
  style={$$props.style}
  withCloseButton={false}
  closeOnBackdropClick={false}
  closeOnEsc={false}
>
  <h1 slot="title" class="headline-small text-content-primary text-center">
    {@html title}
  </h1>

  <p
    slot="description"
    class="body-redular text-content-secondary mt-3 text-center"
  >
    {@html description}
  </p>

  <form slot="action" method="dialog" class="mt-5 flex gap-5">
    <!-- dialogEl.returnValue === cancel -->
    <Button
      type="submit"
      value="cancel"
      variant="primary"
      class="body-small-plus w-full"
    >
      {cancelText}
    </Button>
    <!-- dialogEl.returnValue === cancel -->
    <Button
      type="submit"
      value="confirm"
      variant="tertiary"
      class="body-small-plus w-full"
    >
      {confirmText}
    </Button>
  </form>
</Dialog>
