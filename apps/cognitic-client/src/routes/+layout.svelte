<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  onMount(() => {
    loadAnalytics();
  });
</script>

<PartytownSetup />

<svelte:head>
  <title>{$_('header.title')}</title>
</svelte:head>

<slot />

<NotificationWrapper />
