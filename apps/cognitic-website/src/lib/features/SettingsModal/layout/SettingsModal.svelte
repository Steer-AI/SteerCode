<script lang="ts" context="module">
  const modalOpen = writable(false);

  export function openModal() {
    modalOpen.set(true);
  }
</script>

<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import Button from '$lib/shared/components/Button.svelte';
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import { get, writable } from 'svelte/store';
  import { settingsStore } from '../stores/settings';
  import ApiKeyInput from '../components/ApiKeyInput.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import PersistApiKeySwitch from '../components/PersistApiKeySwitch.svelte';

  let dialogEl: HTMLDialogElement;

  let settingOptions = {
    apiKey: '',
    persistApiKey: true
  };

  $: if (dialogEl && $modalOpen && !dialogEl.open) {
    dialogEl.showModal();
    settingOptions = {
      apiKey: get(settingsStore).openaiAPIKey,
      persistApiKey: true
    };
  }

  function handleSettingsSave() {
    settingsStore.updateSettings({
      openaiAPIKey: settingOptions.apiKey
    });

    if (settingOptions.persistApiKey) {
      localStorage.setItem('cognitic.openAiAPIKey', settingOptions.apiKey);
    } else {
      localStorage.removeItem('cognitic.openAiAPIKey');
    }

    dialogEl.close();
    notificationStore.addNotification({
      type: NotificationType.GeneralSuccess,
      message: $_('notifications.settingsSaved'),
      removeAfter: 3000,
      position: Position.BottomRight
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
    <ApiKeyInput bind:value={settingOptions.apiKey} />
    <p class="text-content-secondary body-small mb-4">
      {$_('settings.apiKeyInput.helperText')}
    </p>
    <PersistApiKeySwitch bind:value={settingOptions.persistApiKey} />
    <p class="text-content-secondary body-small mb-4">
      {$_('settings.apiKeyInput.persistentLabelHelperText')}
    </p>
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
