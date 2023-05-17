import type { Settings } from '$lib/models/types/settings.type';
import type { Option } from '$lib/shared/components/Listbox/types';
import { writable } from 'svelte/store';

function createSettingsStore() {
  const APIKeyFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cognitic.openAiAPIKey')
      : '';

  const backendURLFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cognitic.customBackendUrl')
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

  let currentSettingsValue: Settings = {
    openaiAPIKey: APIKeyFromLS || '',
    selectedRepo: DEFAULT_REPOSITORIES[0],
    customBackendUrl: backendURLFromLS || ''
  };

  const settings = writable<Settings>(currentSettingsValue);

  function updateSettings(newValue: Partial<Settings>) {
    settings.update((current) => {
      const updatedSettings: Settings = { ...current, ...newValue };
      currentSettingsValue = updatedSettings;
      console.log({ updatedSettings, currentSettingsValue });
      return updatedSettings;
    });
    console.log({ currentSettingsValue });
  }

  return {
    subscribe: settings.subscribe,
    updateSettings,
    availableRepositories,
    getValue: () => currentSettingsValue
  };
}

export const settingsStore = createSettingsStore();
