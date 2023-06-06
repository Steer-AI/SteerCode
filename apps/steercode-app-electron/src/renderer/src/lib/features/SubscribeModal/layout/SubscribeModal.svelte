<script lang="ts" context="module">
  let dialogEl: HTMLDialogElement;

  export function openModal() {
    dialogEl.showModal();
  }
</script>

<script lang="ts">
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
</script>

<Dialog
  bind:dialogEl
  on:close={() => dialogEl.close()}
  class="max-h-[75vh] w-full max-w-3xl "
>
  <h3 slot="title" class="headline-small text-content-primary mb-6" />

  <div slot="description" />

  <div slot="action" />
</Dialog>
