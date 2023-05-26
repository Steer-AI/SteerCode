<script lang="ts">
  import type { RepositoryOption } from '$lib/models/types/conversation.type';
  import FolderIcon from '$lib/shared/components/Icons/FolderIcon.svelte';

  export let repository: RepositoryOption;
  export let lastEditDate: Date | null = null;

  const timeSinceLastEdit = (lastDate: Date | null): string => {
    if (!lastDate) {
      return 'Never edited';
    }
    let seconds = Math.floor(
      (new Date().getTime() - lastDate.getTime()) / 1000
    );

    let interval = seconds / 31536000;

    if (interval > 1) {
      return 'Edited ' + Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return 'Edited ' + Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return 'Edited ' + Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return 'Edited ' + Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return 'Edited ' + Math.floor(interval) + ' minutes ago';
    }
    return 'Edited ' + Math.floor(seconds) + ' seconds ago';
  };

  const lastEditFormat = timeSinceLastEdit(lastEditDate);

  const [repoFolder, repoName] = repository.url.split('/').slice(-2);
</script>

<button
  class="text-content-secondary border border-solid border-stroke-secondary px-6 pb-6 pt-5"
>
  <div class="flex items-center">
    <FolderIcon class="mr-3.5 h-[19.5px] w-[22px]" />
    <p class="text-xl font-bold">
      <span>{repoFolder}</span>
      <span> / </span>
      <span class="text-content-primary">{repoName}</span>
    </p>
  </div>
  <div class='mt-4 ml-9'>
    <p class="text-left font-normal">
      {lastEditFormat}
    </p>
  </div>
</button>
