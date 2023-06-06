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
  import Divider from '$lib/shared/components/Divider.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import type { ModalSettingsOptions } from '$lib/models/types/settings.type';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels
  } from '@rgossiaux/svelte-headlessui';
  import GeneralSettings from '../components/GeneralSettings.svelte';
  import AdvancedSettings from '../components/AdvancedSettings.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import FilterIcon from '$lib/shared/components/Icons/FilterIcon.svelte';
  import SubscriptionSettings from '../components/SubscriptionSettings.svelte';
  import CrownIcon from '$lib/shared/components/Icons/CrownIcon.svelte';

  let dialogEl: HTMLDialogElement;

  let settingOptions: ModalSettingsOptions = {
    openaiAPIKey: '',
    persistApiKey: true,
    customBackendUrl: '',
    useCustomBackend: false
  };

  $: if (dialogEl && $modalOpen && !dialogEl.open) {
    dialogEl.showModal();
    const s = get(settingsStore);
    settingOptions = {
      openaiAPIKey: s.openaiAPIKey,
      persistApiKey: true,
      customBackendUrl: s.customBackendUrl,
      useCustomBackend: s.useCustomBackend
    };
  }

  function handleSettingsSave() {
    settingsStore.updateSettings({
      openaiAPIKey: settingOptions.openaiAPIKey,
      customBackendUrl: settingOptions.customBackendUrl,
      useCustomBackend: settingOptions.useCustomBackend
    });
    if (!settingOptions.persistApiKey) {
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
  class="max-h-[75vh] w-full max-w-3xl "
>
  <h3 slot="title" class="headline-small text-content-primary mb-6">
    {$_('settings.title')}
  </h3>

  <TabGroup vertical slot="description" class="flex flex-col gap-4 md:flex-row">
    <TabList
      class="body-regular tablist-settings flex flex-row md:w-1/4 md:flex-col"
    >
      <Tab
        class={({ selected }) =>
          selected
            ? 'tab text-content-primary body-regular-plus bg-background-secondaryActive'
            : 'tab text-content-primarySub hover:text-content-primary hover:bg-background-secondaryHover'}
      >
        <SettingsIcon class="mr-2 h-4 w-4" />
        {$_('settings.general.tab')}
      </Tab>
      <Divider />
      <Tab
        class={({ selected }) =>
          selected
            ? 'tab text-content-primary body-regular-plus bg-background-secondaryActive'
            : 'tab text-content-primarySub hover:text-content-primary hover:bg-background-secondaryHover'}
      >
        <FilterIcon class="mr-2 h-4 w-4" />
        {$_('settings.advanced.tab')}
      </Tab>
      <Tab
        class={({ selected }) =>
          selected
            ? 'tab text-content-primary body-regular-plus bg-background-secondaryActive'
            : 'tab text-content-primarySub hover:text-content-primary hover:bg-background-secondaryHover'}
      >
        <CrownIcon class="mr-2 h-4 w-4" />
        {$_('settings.subscription.tab')}
      </Tab>
    </TabList>

    <TabPanels class="w-3/4">
      <TabPanel class="h-96">
        <GeneralSettings {settingOptions} />
      </TabPanel>
      <TabPanel class="h-96">
        <AdvancedSettings {settingOptions} />
      </TabPanel>
      <TabPanel class="h-96">
        <SubscriptionSettings />
      </TabPanel>
    </TabPanels>
  </TabGroup>

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

<style lang="postcss">
  :global(.tablist-settings .tab) {
    @apply flex h-10 w-full items-center px-4 text-start;
  }
</style>
