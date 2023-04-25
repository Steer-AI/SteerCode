<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { DefaultNotificationOptions } from '../store/notifications';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';

  export let notification: DefaultNotificationOptions;
</script>

<div
  class="bg-background-secondary mx-3 mb-1 flex h-10 items-center px-3"
  transition:slide
>
  <DoneIcon class="text-success mr-2 h-4 w-4" />
  <span class="body-regular text-content-primary">
    {notification.text}
  </span>
</div>
