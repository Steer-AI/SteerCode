<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType } from '$lib/models/enums/notifications';
  import type { Settings } from '$lib/models/types/settings.type';
  import Button from '$lib/shared/components/Button.svelte';
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import { get } from 'svelte/store';
  import { modalOpen } from '../stores/modal';
  import { settingsStore } from '../stores/settings';
  import ApiKeyInput from '../components/ApiKeyInput.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';

  let dialogEl: HTMLDialogElement;

  let newSettings: Settings = {
    ...get(settingsStore)
  };

  $: if (dialogEl && $modalOpen && !dialogEl.open) {
    dialogEl.showModal();
    newSettings = { ...get(settingsStore) }; // create a copy
  }

  function handleSettingsSave() {
    settingsStore.updateSettings(newSettings);
    dialogEl.close();
    notificationStore.addNotification({
      type: NotificationType.GeneralSuccess,
      message: $_('notifications.settingsSaved'),
      removeAfter: 3000
    });

    trackEvent('Save settings');
  }
</script>

<Dialog
  bind:dialogEl
  on:close={() => modalOpen.set(false)}
  class="w-full max-w-sm"
>
  <h3 slot="title" class="headline-small text-content-primary">
    {$_('settings.title')}
  </h3>

  <div
    slot="description"
    class="text-content-secondary body-regular flex flex-col gap-6 py-4"
  >
    <p class="text-content-secondary mb-4">
      {$_('settings.description')}
    </p>
    <ApiKeyInput bind:value={newSettings.openaiAPIKey} />
  </div>

  <div slot="action">
    <Divider class="my-4" />
    <Button
      variant="primary"
      size="medium"
      on:click={handleSettingsSave}
      class="ml-auto"
    >
      {$_('settings.save')}
    </Button>
  </div>
</Dialog>
