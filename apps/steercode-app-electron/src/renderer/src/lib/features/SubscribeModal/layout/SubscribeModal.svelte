<script lang="ts" context="module">
  const modalOpen = writable(false);

  export function openModal() {
    modalOpen.set(true);
  }
</script>

<script lang="ts">
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { get, writable } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { remoteConfig } from '$lib/shared/stores/remoteConfig';

  let dialogEl: HTMLDialogElement;

  $: if (dialogEl && $modalOpen) {
    dialogEl.showModal();
  }
</script>

<Dialog
  bind:dialogEl
  on:close={() => modalOpen.set(false)}
  class="max-h-[75vh] w-full max-w-3xl "
>
  <h3 slot="title" class="headline-small text-content-primary mb-6">
    You've Maxed Out Your Free Requests!
  </h3>

  <div slot="description" class="text-content-primary pb-6 pt-2">
    <p>
      It looks like you've reached the limit of requests for the free tier this
      month. But don't worry - we've got you covered.
    </p>
    <p class="pt-2">
      By upgrading to our premium subscription, you will get <strong>100</strong
      > extra requests per day.
    </p>
  </div>

  <div slot="action">
    {#if $remoteConfig}
      <Button
        as="a"
        variant="primary"
        size="medium"
        target="_blank"
        href={$remoteConfig.stripe_checkout_url}
        class="ml-auto !inline-flex"
      >
        Upgrade to Premium
      </Button>
    {/if}
  </div>
</Dialog>
