<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import SubscribeModal from '$lib/features/SubscribeModal/layout/SubscribeModal.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { Log } from '$lib/core/services/logging';
  import { goto } from '$app/navigation';
  import { remoteConfig } from '$lib/shared/stores/remoteConfig';
  import { getOrCreateAnonymousUID } from '$lib/shared/stores/user';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';

  onMount(() => {
    if (!window.electron) return;
    const uid = getOrCreateAnonymousUID();
    Log.DEBUG('uid', uid);
    loadAnalytics();
    remoteConfig.fetchData();

    window.electron.ipcRenderer.on('open-page', (value: string) => {
      console.log('openPage', { value });
      goto('/' + value);
    });

    window.electron.ipcRenderer.on('update-available', (value: string) => {
      console.log('updateAvailable', { value });
      notificationStore.addNotification({
        message: 'Downloading new update...',
        type: NotificationType.GeneralInfo,
        position: Position.TopRight,
        removeAfter: undefined
      });
    });

    window.electron.ipcRenderer.on('log', (...value: string[]) => {
      console.log('electron: ', ...value);
    });
  });
</script>

<PartytownSetup />

<svelte:head>
  <title>{$_('header.title')}</title>
</svelte:head>

<slot />

<SettingsModal />
<NotificationWrapper />
<SubscribeModal />
