<script lang="ts">
  import type { IFileTreeItem } from 'cognitic-models';
  import FileItem from './FileItem.svelte';
  import { selectedEntities } from '../stores/selection';

  export let expanded = false;
  export let files: IFileTreeItem[];
  export let depth = 0;

  function toggle() {
    expanded = !expanded;
  }
</script>

<button class:expanded on:click={toggle}>{name}</button>

{#if expanded}
  <ul>
    {#each files as file (file.filePath)}
      {@const selected = $selectedEntities.find(
        (s) => s.filePath === file.filePath
      )}
      <li class="h-8 w-full">
        {#if file.isDirectory}
          <svelte:self files={file.children} depth={depth + 1} />
        {:else}
          <FileItem
            on:click={() => {
              if (selected) {
                selectedEntities.remove(selected);
              } else {
                selectedEntities.add(file);
              }
            }}
            {file}
            selected={Boolean(selected)}
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
