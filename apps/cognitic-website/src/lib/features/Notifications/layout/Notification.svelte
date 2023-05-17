<script lang="ts">
  import { NotificationType } from '$lib/models/enums/notifications';
  import { onDestroy } from 'svelte';
  import {
    notificationStore,
    type DefaultNotificationOptions
  } from '../store/notifications';
  import GeneralNotification from '../components/GeneralNotification.svelte';

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
  <GeneralNotification {notification} {onRemove} />
{:else if notification.type === NotificationType.GeneralSuccess}
  <GeneralNotification {notification} {onRemove} />
{:else if notification.type === NotificationType.GeneralInfo}
  <GeneralNotification {notification} {onRemove} />
{/if}
