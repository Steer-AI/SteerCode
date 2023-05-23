import { Log } from '$lib/core/services/logging';
import { getAvailableRepositories } from '$lib/data/settingsQueries';
import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
import { conversationsStore } from '$lib/shared/stores/conversations';
import type { LayoutLoad } from './$types';

export const load = (async () => {
  conversationsStore.fetchFromServer();

  getAvailableRepositories().then((repos) => {
    const tmp = repos.map((repo) => ({
      label: repo.name,
      value: repo,
    }));
    Log.DEBUG('Available repositories', tmp);
    settingsStore.availableRepositories.set(tmp);
    settingsStore.updateSettings({ selectedRepo: tmp[0] });
  });
}) satisfies LayoutLoad;
