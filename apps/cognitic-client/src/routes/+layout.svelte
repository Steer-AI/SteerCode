<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';
  import { USER_COOKIE_ANONYMOUS_ID_NAME } from '$lib/shared/utils/constants';

  onMount(() => {
    if (!window.electron) return;
    const uid = window.electron.getUid();
    console.log('uid', uid);
    localStorage.setItem(USER_COOKIE_ANONYMOUS_ID_NAME, uid);
    loadAnalytics();
  });

  recentRepositories.fetchData();
</script>

<PartytownSetup />

<svelte:head>
  <title>{$_('header.title')}</title>
</svelte:head>

<slot />

<NotificationWrapper />
