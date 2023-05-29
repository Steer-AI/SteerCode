<script lang="ts" context="module">
  const selectedFile = writable<IFileContentItem | null>(null);

  export async function openFilePreviewSidebar(filePath: string) {
    console.log('Opening file preview sidebar for file: ', filePath);
    const contents: [IFileContentItem] = await window.electron.getContents([
      filePath
    ]);
    selectedFile.set(contents[0]);
  }
</script>

<script lang="ts">
  import CodebaseSidebar from '$lib/features/CodebaseSidebar/layout/Sidebar.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import { slide } from 'svelte/transition';
  import FilePreview from '../components/FilePreview.svelte';
  import type { IFileContentItem } from 'cognitic-models';
  import { writable } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import Button from '$lib/shared/components/Button.svelte';
  import ArrowRightIcon from '$lib/shared/components/Icons/ArrowRightIcon.svelte';
</script>

{#if $selectedFile}
  <section
    class="backdrop bg-background-primary absolute inset-0 z-10 bg-opacity-80"
    on:click={() => {
      selectedFile.set(null);
    }}
  />
  <section
    class="file-preview-sidebar absolute bottom-0 right-0 top-0 z-10 flex"
    transition:slide={{ duration: 300, axis: 'x' }}
  >
    <div class="relative">
      <CodebaseSidebar class="h-full" />
      <Button
        variant="tertiary"
        size="small"
        class="absolute right-6 top-5"
        on:click={() => selectedFile.set(null)}
      >
        {$_('conversation.codebaseSidebar.hidePreview')}
        <ArrowRightIcon class="ml-1" />
      </Button>
    </div>

    <Divider vertical />

    <div class="h-full w-full overflow-scroll">
      <FilePreview file={$selectedFile} />
    </div>
  </section>
  <style lang="postcss">
    .file-preview-sidebar {
      width: 80vw;
    }
  </style>
{/if}
