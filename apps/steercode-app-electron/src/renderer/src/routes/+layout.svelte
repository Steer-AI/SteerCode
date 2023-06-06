<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import SubscribeModal from '$lib/features/SubscribeModal/layout/SubscribeModal.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { USER_COOKIE_ANONYMOUS_ID_NAME } from '$lib/shared/utils/constants';
  import { Log } from '$lib/core/services/logging';
  import { goto } from '$app/navigation';
  import { remoteConfig } from '$lib/shared/stores/remoteConfig';
  import { user } from '$lib/shared/stores/user';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';

  onMount(() => {
    if (!window.electron) return;
    const uid = window.electron.getUid();
    Log.DEBUG('uid', uid);
    localStorage.setItem(USER_COOKIE_ANONYMOUS_ID_NAME, uid);
    user.fetchUserInfo(uid);
    loadAnalytics();
    remoteConfig.fetchData();

    window.electron.ipcRenderer.on('open-page', (value: string) => {
      console.log('openPage', { value });
      goto('/' + value);
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
