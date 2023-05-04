<script lang="ts">
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import Button from '$lib/shared/components/Button.svelte';
  import CopyIcon from '$lib/shared/components/Icons/CopyIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import hljs from 'highlight.js';
  import { _ } from 'svelte-i18n';

  export let lang: string;
  export let text: string;

  $: highlighted = hljs.highlight(text, {
    language: lang || 'plaintext'
  }).value;

  let copied = false;

  export function copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          copied = true;
          setTimeout(() => (copied = false), 2000);
        })
        .catch((error) => {
          Log.ERROR('Clipboard writeText failed', error);

          notificationStore.addNotification({
            type: NotificationType.GeneralError,
            message: $_('notifications.failedCopyClipboard'),
            position: Position.BottomRight
          });
        });
    } else {
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: $_('notifications.clipboardAPIError'),
        position: Position.BottomRight
      });
    }
  }
</script>

<div class="not-prose" style="min-width: 256px">
  <div
    class="bg-background-primaryHover flex h-10 w-full items-center justify-between px-4"
  >
    <span class="ml-2 text-xs font-bold text-white">{lang || 'plaintext'}</span>

    <Button
      variant="tertiary"
      size="small"
      class="w-24"
      on:click={() => copyToClipboard(text)}
    >
      {#if copied}
        <DoneIcon class="mr-1 h-3 w-3" />
        {$_('conversation.copied')}
      {:else}
        <CopyIcon class="mr-1 h-3 w-3" />
        {$_('conversation.copy')}
      {/if}
    </Button>
  </div>
  <pre class="{lang} hljs">
    <code>{@html highlighted}</code>
  </pre>
</div>