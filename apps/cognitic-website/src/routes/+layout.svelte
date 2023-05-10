<script lang="ts">
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import PartytownSetup from '../lib/shared/layout/PartytownSetup.svelte';
</script>

<PartytownSetup />

<svelte:head>
  <title>Cognitic | Chat</title>
</svelte:head>

<slot />

<NotificationWrapper />
