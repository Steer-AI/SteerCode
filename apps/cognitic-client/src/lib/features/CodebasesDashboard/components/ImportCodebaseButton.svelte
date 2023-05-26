<script lang="ts">
    import FolderIcon from "$lib/shared/components/Icons/FolderIcon.svelte";
    import PlusIcon from "$lib/shared/components/Icons/PlusIcon.svelte";
    import { selectedRepositoryStore } from "$lib/shared/stores/selectedRepository";
    import { recentRepositories } from "$lib/shared/stores/recentRepositories";
    import { notificationStore } from '$lib/features/Notifications/store/notifications';
    import { NotificationType, Position } from '$lib/models/enums/notifications';
    import { Log } from '$lib/core/services/logging';
    import { goto } from '$app/navigation';

    async function handleImportRepo() {
        if (!window.electron) return;
        const selection = await window.electron.openDialog('showOpenDialog', {
        properties: ['openDirectory']
        });

        try {
        if (selection.canceled) {
            Log.WARNING('User cancelled folder selection...');
            return;
        }
        let folder_path = selection.filePaths[0];
        Log.INFO(`User selected folder ${folder_path}`);
        if (folder_path.endsWith('/')) folder_path = folder_path.slice(0, -1);

        const repo = {
            url: folder_path,
            name: folder_path.split('/').pop() || folder_path,
            last_updated: new Date().toISOString()
        };

        goto('/new');
        selectedRepositoryStore.set(repo);
        recentRepositories.add(repo);
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
    }
</script>

<button class="w-[400px] text-content-primary border border-solid border-stroke-secondary px-6 pb-6 pt-5 flex justify-between items-center" on:click={handleImportRepo}>
    <div class="flex items-center">
        <FolderIcon class="mr-3.5 h-6 w-6 text-content-primarySub" />
        <p class="text-xl text-content-primary font-bold">
            Open local codebase
        </p>
    </div>
    <div class="text-content-tertiary">
        <PlusIcon class="h-6 w-6" />
    </div>
</button>