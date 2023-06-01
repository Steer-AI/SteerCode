<script lang="ts" context="module">
  hljs.registerLanguage('gitconflict', function (hljs) {
    return {
      contains: [
        {
          className: 'deletion !block',
          begin: '^<<<<<<< HEAD.*\n',
          end: '^===',
          excludeBegin: false,
          excludeEnd: true
        },
        {
          className: 'addition !block',
          begin: '====$',
          end: '^>>>>>>> .+$',
          excludeBegin: true,
          excludeEnd: false
        }
      ]
    };
  });
</script>

<script lang="ts">
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import Button from '$lib/shared/components/Button.svelte';
  import CopyIcon from '$lib/shared/components/Icons/CopyIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import hljs from 'highlight.js';
  import { _ } from 'svelte-i18n';
  import { parse } from 'diff2html';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';
  import { LineType, type DiffBlock } from 'diff2html/lib/types';

  let fileName: string = '';
  export let lang: string;
  export let text: string;

  // const isDiff = isEmptyDiff(text);
  // TODO: Detect gitconflict format
  const isDiff = true;

  function isEmptyDiff(diff: string): boolean {
    const change = parse(diff);
    if (change.length > 0) {
      fileName = change[0].newName;
      if ($selectedRepositoryStore) {
        fileName = fileName.replace($selectedRepositoryStore?.url, '');
      }
    }
    return change.length > 0;
  }

  function highlight(code: string, lang: string | undefined) {
    if (isDiff) {
      lang = 'gitconflict';
    }

    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight('\n' + code, { language: lang });
    }
    return hljs.highlightAuto('\n' + code, [
      'gitconflict',
      'typescript',
      'python',
      'bash',
      'java',
      'cpp',
      'javascript',
      'go',
      'ruby',
      'dart',
      'rust',
      'html'
    ]);
  }

  $: highlighted = highlight(text, lang);

  let copied = false;
  let applied = false;

  function copyToClipboard(text: string): void {
    // TODO - find out better approach for copying multiple changes to clipboard
    if (navigator.clipboard) {
      navigator.clipboard;
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

  function getNewVersionFromDiff(diff: string): string {
    const change = parse(diff);

    const changes = [];
    for (const file of change) {
      for (const block of file.blocks) {
        const blockChangesNew = [];
        const blockChangesOld = [];
        for (const diffLine of block.lines) {
          if (diffLine.type === LineType.CONTEXT) {
            blockChangesNew.push(diffLine.content.slice(1));
            blockChangesOld.push(diffLine.content.slice(1));
          }
          if (diffLine.type === LineType.INSERT) {
            blockChangesNew.push(diffLine.content.slice(1));
          }
          if (diffLine.type === LineType.DELETE) {
            blockChangesOld.push(diffLine.content.slice(1));
          }
        }
        const blockChangeNew = blockChangesNew.join('\n');
        const blockChangeOld = blockChangesOld.join('\n');

        const blockChange =
          '<<<<<<<  HEAD\n' +
          blockChangeOld +
          '\n=======\n' +
          blockChangeNew +
          '\n>>>>>>>  updeted version\n';

        changes.push(blockChange);
      }
    }

    const newVersion = changes.join('\n\n\n\n\n');
    return newVersion;
  }

  function applyChange(diff: string): void {
    window.electron
      .applyDiff(diff)
      .then(() => {
        applied = true;
        setTimeout(() => (applied = false), 2000);
      })
      .catch((error) => {
        Log.ERROR('Apply code change failed', error);

        notificationStore.addNotification({
          type: NotificationType.GeneralError,
          message: $_('notifications.failedApplyChange'),
          position: Position.BottomRight
        });
      });
  }
</script>

<div class="not-prose" style="min-width: 256px">
  <div
    class="bg-background-primary flex h-10 items-center justify-between px-3"
  >
    {#if isDiff}
      <span class="text-xs font-bold text-white">{fileName}</span>
    {:else}
      <span class="text-xs font-bold text-white">{highlighted.language}</span>
    {/if}

    <div class="flex items-center justify-between space-x-2">
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

      {#if isDiff}
        <Button
          variant="secondary"
          size="small"
          class="w-40"
          on:click={() => applyChange(text)}
        >
          {#if applied}
            <DoneIcon class="mr-1 h-3 w-3" />
            {$_('conversation.applied')}
          {:else}
            <CopyIcon class="mr-1 h-3 w-3" />
            {$_('conversation.apply')}
          {/if}
        </Button>
      {/if}
    </div>
  </div>
  <pre class="{highlighted.language} hljs bg p-3">
    <code class="mono-regular">{@html highlighted.value}</code>
  </pre>
</div>