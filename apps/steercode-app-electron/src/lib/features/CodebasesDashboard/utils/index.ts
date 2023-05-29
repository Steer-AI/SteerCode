import { goto } from '$app/navigation';
import { Log } from '$lib/core/services/logging';
import { notificationStore } from '$lib/features/Notifications/store/notifications';
import { NotificationType, Position } from '$lib/models/enums/notifications';
import { recentRepositories } from '$lib/shared/stores/recentRepositories';
import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';

export async function handleImportRepo() {
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
    Log.DEBUG(`User selected folder ${folder_path}`);
    if (folder_path.endsWith('/')) folder_path = folder_path.slice(0, -1);

    const repo = {
      url: folder_path,
      name: folder_path.split('/').pop() || folder_path
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
