<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';

  onMount(() => {
    if (!window.electron) return;
    const uid = window.electron.getUid();
    console.log('uid', uid);
    Cookies.set('uid', uid);
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
