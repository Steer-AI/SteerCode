<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
  import CookieBanner from '$lib/shared/layout/CookieBanner.svelte';
  import { loadAnalytics } from '$lib/core/services/tracking';
</script>

<CookieBanner on:analytics={() => loadAnalytics()} />

<PartytownSetup />

<svelte:head>
  <title>Cognitic | Chat</title>
</svelte:head>

<slot />

<NotificationWrapper />
