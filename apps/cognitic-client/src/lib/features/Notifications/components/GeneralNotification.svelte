<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { DefaultNotificationOptions } from '../store/notifications';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import { NotificationType } from '$lib/models/enums/notifications';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import InfoIcon from '$lib/shared/components/Icons/InfoIcon.svelte';
  import ErrorIcon from '$lib/shared/components/Icons/ErrorIcon.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';

  export let notification: DefaultNotificationOptions;
  export let onRemove: () => void;

  $: removable = notification.removeAfter === undefined;
</script>

<div
  class="bg-background-secondary mx-3 mb-1 flex items-center gap-2 px-3 py-2"
  transition:slide
>
  {#if notification.type === NotificationType.GeneralError}
    <ErrorIcon class="text-error h-4 w-4 flex-shrink-0" />
  {:else if notification.type === NotificationType.GeneralSuccess}
    <DoneIcon class="text-success h-4 w-4 flex-shrink-0" />
  {:else if notification.type === NotificationType.GeneralInfo}
    <InfoIcon
      filled={false}
      class="text-content-secondary h-4 w-4 flex-shrink-0"
    />
  {/if}

  <span class="body-regular text-content-primary mr-auto">
    {notification.message}
  </span>

  {#if removable}
    <Divider vertical class="ml-2 h-4" />
    <button on:click={() => onRemove()}>
      <CloseIcon
        class="text-content-secondary hover:text-content-primary h-4 w-4 flex-shrink-0"
      />
    </button>
  {/if}
</div>
