<script lang="ts">
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType } from '$lib/models/enums/notifications';
  import Button from '$lib/shared/components/Button.svelte';
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import { modalOpen } from '../stores/modal';

  let dialogEl: HTMLDialogElement;

  $: if (dialogEl && $modalOpen) {
    dialogEl.showModal();
  }

  function handleSettingsSave() {
    // TODO: save settings
    Log.DEBUG('Settings saved');
    dialogEl.close();

    notificationStore.addNotification({
      type: NotificationType.GeneralSuccess,
      text: 'Settings saved',
      removeAfter: 3000
    });
  }
</script>

<Dialog
  bind:dialogEl
  on:close={() => modalOpen.set(false)}
  class="w-full max-w-sm"
>
  <h3 slot="title" class="headline-small text-content-primary">Settings</h3>

  <div slot="description" class="text-content-secondary body-regular my-3">
    <!-- TODO: implement this -->
    TODO: settings
  </div>

  <div slot="action">
    <Button
      variant="primary"
      size="medium"
      on:click={handleSettingsSave}
      class="ml-auto"
    >
      Save changes
    </Button>
  </div>
</Dialog>
