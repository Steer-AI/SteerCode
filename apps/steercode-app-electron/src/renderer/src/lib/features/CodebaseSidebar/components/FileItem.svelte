<script lang="ts">
  import Checkbox from '$lib/shared/components/Checkbox.svelte';
  import type { IFileTreeItem } from 'cognitic-models';
  import { tick } from 'svelte';
  import { getClassWithColor } from 'file-icons-js';
  import { openFilePreviewSidebar } from '$lib/features/FilePreviewSidebar/layout/Sidebar.svelte';
  import FileIcon from '$lib/shared/components/Icons/FileIcon.svelte';

  export let file: IFileTreeItem;
  export let selected: boolean;
  export let depth = 1;

  $: iconClassName = getClassWithColor(file.fileName);

  let divElement: HTMLElement;

  async function handleInteraction(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
    event.stopPropagation();

    await tick();
    (
      divElement.querySelector('.checkbox-container input') as HTMLElement
    )?.click();
  }

  async function handleFileClick() {
    openFilePreviewSidebar(file.filePath);
  }
</script>

<div
  bind:this={divElement}
  on:click={handleInteraction}
  on:keydown={handleInteraction}
  role="button"
  tabindex="0"
  class="flex h-7 w-full items-center pr-6 {selected
    ? 'bg-primary bg-opacity-5'
    : ''} hover:bg-primary focus:bg-primary flex cursor-pointer items-center hover:bg-opacity-10 focus:bg-opacity-10"
  style="padding-left: calc(1.5rem + (1.25rem * {depth - 1}))"
>
  <div class="w-5">
    {#if iconClassName}
      <div class="mx-auto w-4 {iconClassName}" />
    {:else}
      <FileIcon class="mx-auto h-4 w-auto" />
    {/if}
  </div>

  <button
    on:click|stopPropagation={handleFileClick}
    class="body-regular w-full overflow-y-scroll text-start hover:underline {selected
      ? 'text-content-primary'
      : 'text-content-primarySub'} mx-2 whitespace-nowrap"
  >
    {file.fileName}
  </button>
  <Checkbox
    class="bg-background-primary rignt-0 sticky flex cursor-pointer items-center"
    checkboxClass="w-3 h-3 ml-auto flex-shrink-0"
    checked={selected}
    on:click
  />
</div>
