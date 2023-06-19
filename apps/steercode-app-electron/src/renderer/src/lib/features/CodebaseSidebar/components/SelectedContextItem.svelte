<script lang="ts">
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import type { IFileTreeItem } from 'cognitic-models';
  import { selectedEntities } from '../stores/selection';
  import { getClassWithColor } from 'file-icons-js';
  import { onMount } from 'svelte/internal';
  import FileIcon from '$lib/shared/components/Icons/FileIcon.svelte';

  // TODO:
  export let prefixPath: string;
  export let item: IFileTreeItem;

  let divElement: HTMLDivElement;
  let paths: string[];

  $: suffixPath = item.filePath.replace(prefixPath, '');
  $: paths = suffixPath.split('/');
  $: subPath = paths.slice(0, paths.length - 1).join(' / ') + ' / ';
  $: fileOrDirectory = paths[paths.length - 1];

  $: iconClassName = getClassWithColor(item.fileName);

  onMount(() => {
    divElement.scrollLeft = divElement.scrollWidth - divElement.clientWidth;
  });
</script>

<button
  class="body-regular hover:bg-primary focus:bg-primary flex h-8 w-full items-center px-6 hover:bg-opacity-10 focus:bg-opacity-10"
  on:click={() => {
    selectedEntities.remove(item);
  }}
>
  <div class="w-5">
    {#if iconClassName}
      <div class="mx-auto w-4 {iconClassName}" />
    {:else}
      <FileIcon class="mx-auto h-4 w-auto" />
    {/if}
  </div>

  <div
    class="mt-1 flex flex-1 overflow-x-auto whitespace-nowrap"
    bind:this={divElement}
  >
    <span class="text-content-secondary ml-2">
      {subPath}
    </span>
    <span class="text-content-primary ml-1">
      {fileOrDirectory}
    </span>
  </div>

  <CloseIcon
    class="text-content-tertiary hover:text-content-primary ml-4 h-3 w-3 flex-shrink-0"
  />
</button>
