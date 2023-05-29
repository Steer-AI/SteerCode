<script lang="ts">
  import FolderIcon from '$lib/shared/components/Icons/FolderIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import { handleImportRepo } from '../utils';
  import { _ } from 'svelte-i18n';
</script>

<button
  class="text-content-primary border-stroke-secondary hover:bg-background-primaryHover flex h-16 w-96 items-center justify-between border border-solid px-6"
  on:click={handleImportRepo}
>
  <div class="flex items-center">
    <FolderIcon class="text-content-primarySub mr-3 h-7 w-auto" />
    <p class="text-content-primary headline-small">
      {$_('header.importRepoButton')}
    </p>
  </div>
  <div class="text-content-tertiary">
    <PlusIcon class="h-6 w-6" />
  </div>
</button>
