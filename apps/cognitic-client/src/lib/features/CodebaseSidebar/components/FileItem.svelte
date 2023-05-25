<script lang="ts">
  import Checkbox from '$lib/shared/components/Checkbox.svelte';
  import type { IFileTreeItem } from 'cognitic-models';
  export let file: IFileTreeItem;
  export let selected: boolean;
  import { getClassWithColor } from 'file-icons-js';

  $: iconClassName = getClassWithColor(file.fileName);
</script>

<div
  class="h-7 w-full {selected
    ? 'bg-background-primary bg-opacity-10'
    : ''} flex items-center"
>
  <Checkbox
    class="flex w-full items-center"
    checkboxClass="w-3 h-3 ml-auto flex-shrink-0"
    checked={selected}
    on:click
  >
    <div slot="before" class="flex flex-1 items-center overflow-hidden">
      <div class="w-5">
        {#if iconClassName}
          <div class="mx-auto w-4 {iconClassName}" />
        {:else}
          <svg
            viewBox="0 0 13 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto h-4 w-auto"
          >
            <path
              d="M0 1.75C0 0.784 0.784 0 1.75 0H8.336C8.8 0 9.245 0.184 9.573 0.513L12.487 3.427C12.816 3.755 13 4.2 13 4.664V14.25C13 14.7141 12.8156 15.1592 12.4874 15.4874C12.1592 15.8156 11.7141 16 11.25 16H1.75C1.28587 16 0.840752 15.8156 0.512563 15.4874C0.184375 15.1592 0 14.7141 0 14.25V1.75ZM1.75 1.5C1.6837 1.5 1.62011 1.52634 1.57322 1.57322C1.52634 1.62011 1.5 1.6837 1.5 1.75V14.25C1.5 14.388 1.612 14.5 1.75 14.5H11.25C11.3163 14.5 11.3799 14.4737 11.4268 14.4268C11.4737 14.3799 11.5 14.3163 11.5 14.25V6H8.75C8.28587 6 7.84075 5.81563 7.51256 5.48744C7.18437 5.15925 7 4.71413 7 4.25V1.5H1.75ZM8.5 1.562V4.25C8.5 4.388 8.612 4.5 8.75 4.5H11.438L11.427 4.487L8.513 1.573L8.5 1.562Z"
              fill="white"
            />
          </svg>
        {/if}
      </div>

      <span
        class="body-regular {selected
          ? 'text-content-primary'
          : 'text-content-primarySub'} mx-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
      >
        {file.fileName}
      </span>
    </div>
  </Checkbox>
</div>
