<script lang="ts">
  import FolderIcon from '$lib/shared/components/Icons/FolderIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import { handleImportRepo } from '../utils';
  import { _ } from 'svelte-i18n';
</script>

<button
  class="text-content-primary border-stroke-secondary hover:bg-background-primaryHover flex w-[400px] items-center justify-between border border-solid px-6 pb-6 pt-5"
  on:click={handleImportRepo}
>
  <div class="flex items-center">
    <FolderIcon class="text-content-primarySub mr-3.5 h-6 w-6" />
    <p class="text-content-primary text-xl font-bold">
      {$_('header.importRepoButton')}
    </p>
  </div>
  <div class="text-content-tertiary">
    <PlusIcon class="h-6 w-6" />
  </div>
</button>
