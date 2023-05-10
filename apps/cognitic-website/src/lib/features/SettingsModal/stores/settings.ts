import { Log } from '$lib/core/services/logging';
import { getAvailableRepositories } from '$lib/data/settingsQueries';
import type { Settings } from '$lib/models/types/settings.type';
import type { Option } from '$lib/shared/components/Listbox/types';
import { writable } from 'svelte/store';

function createSettingsStore() {
  const APIKeyFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('OPENAI_API_KEY')
      : '';

  const DEFAULT_REPOSITORIES: Option<string>[] = [
    {
      label: 'LangChain',
      value: 'https://github.com/hwchase17/langchain',
      version: undefined
    }
  ];
  const availableRepositories =
    writable<Option<string>[]>(DEFAULT_REPOSITORIES);

  const settings = writable<Settings>({
    openaiAPIKey: APIKeyFromLS || '',
    selectedRepo: DEFAULT_REPOSITORIES[0]
  });

  function updateSettings(newValue: Partial<Settings>) {
    settings.update((current) => {
      const updatedSettings: Settings = { ...current, ...newValue };
      return updatedSettings;
    });
  }

  // fetch from server
  getAvailableRepositories().then((repos) => {
    const tmp = repos.map((repo) => ({
      label: repo.name,
      value: repo.url,
      version: repo.version
    }));
    Log.DEBUG('Available repositories', tmp);
    availableRepositories.set(tmp);
    updateSettings({ selectedRepo: tmp[0] });
  });

  return {
    subscribe: settings.subscribe,
    updateSettings,
    availableRepositories
  };
}

export const settingsStore = createSettingsStore();
