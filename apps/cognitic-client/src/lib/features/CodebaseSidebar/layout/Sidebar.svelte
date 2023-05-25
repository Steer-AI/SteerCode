<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';
  import { _ } from 'svelte-i18n';
  import { selectedEntities } from '../stores/selection';
  import SelectedContextItem from '../components/SelectedContextItem.svelte';
  import type { IFileTreeItem } from 'cognitic-models';
  import FileTreeItem from '../components/FileTreeItem.svelte';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { Log } from '$lib/core/services/logging';
  import 'file-icons-js/css/style.css';
  import type { RepositoryOption } from '$lib/models/types/conversation.type';

  export let selectedRepo: RepositoryOption | null;
  let initialFileTreeFile: IFileTreeItem | null;

  async function fetchFileTreeItem(item: IFileTreeItem, depth: number) {
    Log.INFO('fetchFileTreeItem', { item, depth });

    if (!item.isDirectory) return;
    if (item.children.length !== 0) return;

    try {
      const fileTree = await window.electron.getTree(item.filePath, depth);
      item.children = fileTree;
      initialFileTreeFile = initialFileTreeFile;
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

  function handleUpdate(selectedRepo: RepositoryOption | null) {
    if (!selectedRepo) {
      initialFileTreeFile = null;
      selectedEntities.clear();
      return;
    }

    if (!initialFileTreeFile) {
      initialFileTreeFile = {
        isDirectory: true,
        fileName: selectedRepo.name,
        filePath: selectedRepo.url,
        children: []
      };
      selectedEntities.clear();
      fetchFileTreeItem(initialFileTreeFile, 1);
      return;
    }

    if (selectedRepo.url !== initialFileTreeFile.filePath) {
      initialFileTreeFile = {
        isDirectory: true,
        fileName: selectedRepo.name,
        filePath: selectedRepo.url,
        children: []
      };
      selectedEntities.clear();
      fetchFileTreeItem(initialFileTreeFile, 1);
      return;
    }
  }

  $: handleUpdate(selectedRepo);
</script>

<aside class="flex" style={$$props.style}>
  <Divider vertical />
  <div class="bg-background-primary flex w-[400px] flex-col">
    <div
      class="headline-large text-content-primary flex h-14 items-center px-6"
    >
      {$_('conversation.cosebaseSidebar.codebaseTitle')}
    </div>

    <!-- scrollable file tree -->
    <section class="flex-[2] overflow-y-auto">
      {#if initialFileTreeFile}
        <FileTreeItem
          expanded={true}
          file={initialFileTreeFile}
          on:expand={(e) => {
            fetchFileTreeItem(e.detail, 1);
          }}
        />
      {:else}
        <div class="text-content-secondary body-regular flex-1 px-6">
          {$_('conversation.cosebaseSidebar.noCodebase')}
        </div>
      {/if}
    </section>

    <Divider />

    <div
      class="headline-large text-content-primary flex h-14 items-center px-6"
    >
      {$_('conversation.cosebaseSidebar.contextTitle')}
    </div>

    {#if $selectedEntities.length === 0 || !initialFileTreeFile}
      <div class="text-content-secondary body-regular flex-1 px-6">
        {$_('conversation.cosebaseSidebar.noContext')}
      </div>
    {:else}
      <!-- scrollable selected files -->
      <section class="flex-1 overflow-y-scroll">
        {#each $selectedEntities as entity (entity.filePath)}
          <SelectedContextItem
            item={entity}
            prefixPath={initialFileTreeFile.filePath}
          />
        {/each}
      </section>
    {/if}
  </div>
</aside>
