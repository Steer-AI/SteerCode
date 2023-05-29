<script lang="ts">
  import type { RepositoryOption } from '$lib/models/types/conversation.type';
  import FolderIcon from '$lib/shared/components/Icons/FolderIcon.svelte';
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';
  import { goto } from '$app/navigation';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';

  export let repository: RepositoryOption;

  const timeSinceLastEdit = (lastEditTimestamp: string | undefined): string => {
    if (!lastEditTimestamp) {
      Log.WARNING('No last edit timestamp found');
      Log.DEBUG(JSON.stringify(repository));
      return 'Never edited';
    }

    try {
      const lastEdit = new Date(lastEditTimestamp);
      let seconds = Math.floor(
        (new Date().getTime() - lastEdit.getTime()) / 1000
      );

      let interval = seconds / 31556926;

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
    } catch (e) {
      console.warn('Invalid last edit timestamp', lastEditTimestamp, e);
      return 'Never edited';
    }
  };

  $: lastEditFormat = timeSinceLastEdit(repository.last_update);

  const loadRepo = () => {
    try {
      goto('/new');
      selectedRepositoryStore.set(repository);
      recentRepositories.add(repository);
    } catch (error: any) {
      Log.ERROR(
        `Error occured during the folder selection process ${error.message}`
      );
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: error.message,
        position: Position.BottomRight
      });
    }
  };

  const [repoFolder, repoName] = repository.url.split('/').slice(-2);
</script>

<button
  class="text-content-secondary border-stroke-secondary hover:bg-backgroun-primaryHover h-20 border border-solid px-6 py-1"
  on:click={loadRepo}
>
  <FolderIcon class="mr-3 h-8 w-auto" />

  <div class="flex items-center">
    <p class="headline-large">
      <span>{repoFolder}</span>
      <span> / </span>
      <span class="text-content-primary">{repoName}</span>
    </p>
  </div>

  <div />
  {#if repository.last_update}
    <div class="body-small">
      <p class="text-left font-normal">
        {lastEditFormat}
      </p>
    </div>
  {/if}
</button>

<style lang="postcss">
  button {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
  }
</style>
