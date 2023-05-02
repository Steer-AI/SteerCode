<script lang="ts">
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType } from '$lib/models/enums/notifications';
  import type { Settings } from '$lib/models/types/settings.type';
  import Button from '$lib/shared/components/Button.svelte';
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import { get } from 'svelte/store';
  import { modalOpen } from '../stores/modal';
  import { settingsStore } from '../stores/settings';
  import TemperatureSwitcher from '../components/TemperatureSwitcher.svelte';
  import ModelSelector from '../components/ModelSelector.svelte';
  import ApiKeyInput from '../components/ApiKeyInput.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import { trackEvent } from '$lib/core/services/tracking';

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
      message: 'Settings saved',
      removeAfter: 3000
    });

    trackEvent('Save settings', {
      model: newSettings.openaiModel,
      temperature: newSettings.temperature
    });
  }
</script>

<Dialog
  bind:dialogEl
  on:close={() => modalOpen.set(false)}
  class="w-full max-w-sm"
>
  <h3 slot="title" class="headline-small text-content-primary">Settings</h3>

  <div
    slot="description"
    class="text-content-secondary body-regular flex flex-col gap-6 py-4"
  >
    <p class="text-content-secondary mb-4">
      You can change the settings for the AI model here. The settings will apply
      right away to the next generated text.
    </p>
    <ApiKeyInput bind:value={newSettings.openaiAPIKey} />
    <ModelSelector bind:value={newSettings.openaiModel} />
    <InputField
      class="body-regular !bg-background-secondaryHover h-8 px-3"
      labelClass="flex items-start flex-col"
      bind:value={newSettings.openaiModel}
    />

    <TemperatureSwitcher bind:value={newSettings.temperature} />
  </div>

  <div slot="action">
    <Divider class="my-4" />
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
