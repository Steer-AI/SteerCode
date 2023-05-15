<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { DefaultNotificationOptions } from '../store/notifications';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';

  export let notification: DefaultNotificationOptions;
</script>

<div
  class="bg-background-secondary mx-3 mb-1 flex items-center px-3 py-2"
  transition:slide
>
  <CloseIcon class="text-error mr-2 h-4 w-4 flex-shrink-0" />
  <span class="body-regular text-content-primary">
    {notification.message}
  </span>
</div>
