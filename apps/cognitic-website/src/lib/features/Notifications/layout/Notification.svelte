<script lang="ts">
  import { NotificationType } from '$lib/models/enums/notifications';
  import { onDestroy } from 'svelte';
  import GeneralError from '../components/GeneralError.svelte';
  import {
    notificationStore,
    type DefaultNotificationOptions
  } from '../store/notifications';
  import GeneralSuccess from '../components/GeneralSuccess.svelte';
  import GeneralInfo from '../components/GeneralInfo.svelte';

  export let notification: DefaultNotificationOptions;
  // `onRemove` function will be passed into your component.
  const { id, removeAfter } = notification;

  const onRemove = () => notificationStore.removeNotification(id);

  let timeoutId: null | ReturnType<typeof setTimeout> = null;

  if (removeAfter) {
    timeoutId = setTimeout(onRemove, removeAfter);
  }

  onDestroy(() => {
    if (removeAfter && timeoutId) clearTimeout(timeoutId);
  });
</script>

{#if notification.type === NotificationType.GeneralError}
  <GeneralError {notification} />
{:else if notification.type === NotificationType.GeneralSuccess}
  <GeneralSuccess {notification} />
{:else if notification.type === NotificationType.GeneralInfo}
  <GeneralInfo {notification} />
{/if}
