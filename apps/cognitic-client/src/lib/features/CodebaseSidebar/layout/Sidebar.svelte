<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';
  import { _ } from 'svelte-i18n';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { selectedEntities } from '../stores/selection';
  import SelectedContextItem from '../components/SelectedContextItem.svelte';
  import type {
    IErrorResponse,
    IFileTreeItem,
    IFileTreeResponse
  } from 'cognitic-models';
  import FileTreeItem from '../components/FileTreeItem.svelte';
  import { getFileTree } from '$lib/data/localQueries';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { Log } from '$lib/core/services/logging';
  import { onMount } from 'svelte';
  import 'file-icons-js/css/style.css';

  export let conversation: Conversation;
  let initialFileTreeFile: IFileTreeItem;

  function isSuccesResponse(
    x: IFileTreeResponse | IErrorResponse
  ): x is IFileTreeResponse {
    return x.success;
  }

  async function fetchFileTreeItem(
    root: IFileTreeItem,
    item: IFileTreeItem,
    depth: number
  ) {
    Log.INFO('fetchFileTreeItem', { root, item, depth });

    if (!item.isDirectory) return;
    if (item.children.length !== 0) return;

    try {
      const fileTree = await getFileTree(item.filePath, depth);
      item.children = fileTree;
      initialFileTreeFile = root;
      Log.INFO('initialFileTreeFile + resp', { initialFileTreeFile, fileTree });
    } catch (error: any) {
      Log.ERROR(error.message);
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: error.message,
        position: Position.BottomRight
      });
    }
  }

  onMount(() => {
    initialFileTreeFile = {
      isDirectory: true,
      fileName: conversation.value.repository.name,
      filePath: conversation.value.repository.url,
      children: []
    };
    fetchFileTreeItem(initialFileTreeFile, initialFileTreeFile, 0);
  });
</script>

<aside class="flex" style={$$props.style}>
  <Divider vertical />
  <div class="bg-background-primary flex w-80 flex-col">
    <div
      class="headline-large text-content-primary flex h-14 items-center px-4"
    >
      {$_('conversation.cosebaseSidebar.codebaseTitle')}
    </div>

    <!-- scrollable file tree -->
    <section class="flex-[2] overflow-y-scroll px-4">
      {#if initialFileTreeFile}
        <FileTreeItem
          file={initialFileTreeFile}
          on:expand={(e) => {
            fetchFileTreeItem(initialFileTreeFile, e.detail, 1);
          }}
        />
      {/if}
    </section>

    <Divider />

    <div
      class="headline-large text-content-primary flex h-14 items-center px-4"
    >
      {$_('conversation.cosebaseSidebar.contextTitle')}
    </div>

    <!-- scrollable selected files -->
    <section class="flex-1 overflow-y-scroll px-4">
      {#each $selectedEntities as entity (entity.filePath)}
        <SelectedContextItem item={entity} {conversation} />
      {/each}
    </section>
  </div>
</aside>
