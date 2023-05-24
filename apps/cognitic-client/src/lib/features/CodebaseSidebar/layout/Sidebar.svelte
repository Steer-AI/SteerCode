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
  import { fetchFileTree } from '$lib/data/localQueries';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { Log } from '$lib/core/services/logging';

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

    const resp = await fetchFileTree(item.filePath, depth);
    if (isSuccesResponse(resp)) {
      // TODO: verify
      item.children = resp.content;
      Log.INFO('initialFileTreeFile + resp', { initialFileTreeFile, resp });
    } else {
      Log.ERROR(resp.message);
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: resp.message,
        position: Position.BottomRight
      });
    }
  }

  $: {
    initialFileTreeFile = {
      isDirectory: true,
      fileName: conversation.value.repository.name,
      filePath: conversation.value.repository.url,
      children: []
    };
    fetchFileTreeItem(initialFileTreeFile, initialFileTreeFile, 0);
  }

  $: console.log('selectedEntities', $selectedEntities);
  $: console.log('initialFileTreeFile', initialFileTreeFile);
</script>

<aside class="flex" style={$$props.style}>
  <Divider vertical />
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="headline-large text-content-primary h-14">
      {$_('conversation.cosebaseSidebar.codebaseTitle')}
    </div>

    <!-- scrollable file tree -->
    <section class="flex-[2] overflow-y-scroll">
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

    <div class="headline-large text-content-primary h-14">
      {$_('conversation.cosebaseSidebar.contextTitle')}
    </div>

    <!-- scrollable selected files -->
    <section class="flex-1 overflow-y-scroll">
      {#each $selectedEntities as entity (entity.filePath)}
        <SelectedContextItem item={entity} {conversation} />
      {/each}
    </section>
  </div>
</aside>
