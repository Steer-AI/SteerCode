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
  import { writable } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { remoteConfig } from '$lib/shared/stores/remoteConfig';
  import { user } from '$lib/shared/stores/user';

  let dialogEl: HTMLDialogElement;

  $: if (dialogEl && $modalOpen) {
    dialogEl.showModal();
  }
</script>

<Dialog
  bind:dialogEl
  on:close={() => modalOpen.set(false)}
  class="max-h-[75vh] w-full max-w-2xl "
>
  <h3 slot="title" class="headline-large text-content-primary mb-6 text-center">
    {$_('subscribeModal.title')}
  </h3>

  <div
    slot="description"
    class="body-regular text-content-primarySub mx-auto max-w-sm pb-6 pt-2 text-center"
  >
    <p class="mb-6">
      {@html $_('subscribeModal.description1')}
    </p>
    <p>
      {@html $_('subscribeModal.description2')}
    </p>
  </div>

  <div slot="action" class="flex justify-center">
    {#if $remoteConfig}
      <Button
        variant="primary"
        size="medium"
        on:click={() => {
          trackEvent('subscribe', { from: 'popup' });
          if ($user) {
            window.open(
              $remoteConfig.stripe_checkout_url +
                '?client_reference_id=' +
                $user.uid,
              '_blank'
            );
            return;
          }
          window.open('https://steercode.com/auth-steercode');
        }}
      >
        {$_('subscribeModal.subscribeButton')}
      </Button>
    {/if}
  </div>
</Dialog>
