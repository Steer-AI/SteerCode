<script lang="ts" context="module">
  let _initialFileTreeFile: IFileTreeItem | null = null;
  const initialFileTreeFile = writable<IFileTreeItem | null>(
    _initialFileTreeFile
  );
</script>

<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';

  import { _ } from 'svelte-i18n';
  import { selectedEntities } from '../stores/selection';
  import SelectedContextItem from '../components/SelectedContextItem.svelte';
  import RefreshIcon from '$lib/shared/components/Icons/RefreshIcon.svelte';
  import type { IFileTreeItem } from 'cognitic-models';
  import FileTreeItem from '../components/FileTreeItem.svelte';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { Log } from '$lib/core/services/logging';
  import 'file-icons-js/css/style.css';
  import { filteredFiles } from '../stores/filteredFiles';
  import type { RepositoryOption } from '$lib/models/types/conversation.type';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';
  import InputField from '$lib/shared/components/InputField.svelte';
  import { writable } from 'svelte/store';

  async function fetchFileTreeItem(item: IFileTreeItem, depth: number) {
    if (!item.isDirectory) return;
    if (item.children.length !== 0) return;

    try {
      const fileTree = await window.electron.getTree(item.filePath, depth);
      item.children = fileTree;
      initialFileTreeFile.set(_initialFileTreeFile);
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
    const selectedFilePaths = $selectedEntities.map(
      (entity) => entity.filePath
    );
    _initialFileTreeFile = null;
    if (!selectedRepo) {
      initialFileTreeFile.set(null);
      selectedEntities.clear();
      return;
    }

    if (
      !_initialFileTreeFile ||
      selectedRepo.url !== _initialFileTreeFile.filePath
    ) {
      _initialFileTreeFile = {
        isDirectory: true,
        fileName: selectedRepo.name,
        filePath: selectedRepo.url,
        children: [],
        expanded: true
      };
      initialFileTreeFile.set(_initialFileTreeFile);
      selectedEntities.clear();
      fetchFileTreeItem(_initialFileTreeFile, -1).then(() => {
        selectedFilePaths.forEach((filePath) => {
          const entity = findFileTreeItemByPath(
            _initialFileTreeFile!,
            filePath
          );
          if (entity) selectedEntities.add(entity);
          return;
        });
      });
    }
  }

  function findFileTreeItemByPath(
    item: IFileTreeItem,
    path: string
  ): IFileTreeItem | null {
    if (item.filePath === path) return item;
    console.log(item.children);
    for (const child of item.children) {
      const found = findFileTreeItemByPath(child, path);
      if (found) return found;
    }
    return null;
  }

  $: handleUpdate($selectedRepositoryStore);
</script>

<aside class="flex {$$props.class}" style={$$props.style}>
  <Divider vertical />
  <div class="bg-background-primary flex w-[400px] flex-col">
    <div
      class="headline-large text-content-primary flex h-14 items-center px-6"
    >
      {$_('conversation.codebaseSidebar.codebaseTitle')}

      <button
        on:click={() => handleUpdate($selectedRepositoryStore)}
        class="text-content-primarySub ml-auto"
      >
        <RefreshIcon
          class="text-content-secondary hover:text-content-primary active:text-primary h-4 w-4 transition-colors duration-150"
        />
      </button>
    </div>

    {#if $initialFileTreeFile}
      <InputField
        class="h-8 w-full px-3 py-2 pr-10 text-sm"
        labelClass="mx-6 mb-3"
        type="text"
        placeholder="Search..."
        on:input={(e) =>
          filteredFiles.search(e?.target?.value, $initialFileTreeFile)}
      />
    {/if}

    <!-- scrollable file tree -->
    <section class="flex-[2] overflow-y-auto">
      {#if $initialFileTreeFile}
        {#if $filteredFiles}
          {#if $filteredFiles.children.length > 0}
            <FileTreeItem
              file={$filteredFiles}
              on:expand={(e) => {
                fetchFileTreeItem(e.detail, 1);
              }}
            />
          {:else}
            <div class="text-content-secondary body-regular flex-1 px-6">
              {$_('conversation.codebaseSidebar.emptySearch')}
            </div>
          {/if}
        {:else}
          <FileTreeItem
            file={$initialFileTreeFile}
            on:expand={(e) => {
              fetchFileTreeItem(e.detail, 1);
            }}
          />
        {/if}
      {:else}
        <div class="text-content-secondary body-regular flex-1 px-6">
          {$_('conversation.codebaseSidebar.noCodebase')}
        </div>
      {/if}
    </section>

    <Divider />

    <div
      class="headline-large text-content-primary flex h-14 items-center px-6"
    >
      {$_('conversation.codebaseSidebar.contextTitle')}
    </div>

    {#if $selectedEntities.length === 0 || !$initialFileTreeFile}
      <div class="text-content-secondary body-regular flex-1 px-6">
        {$_('conversation.codebaseSidebar.noContext')}
      </div>
    {:else}
      <!-- scrollable selected files -->
      <section class="flex-1 flex-shrink-0 overflow-y-scroll">
        {#each $selectedEntities as entity (entity.filePath)}
          <SelectedContextItem
            item={entity}
            prefixPath={$initialFileTreeFile.filePath}
          />
        {/each}
      </section>
    {/if}
  </div>
</aside>
