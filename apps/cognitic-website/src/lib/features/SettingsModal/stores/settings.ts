import type { Settings } from '$lib/models/types/settings.type';
import type { Option } from '$lib/shared/components/Listbox/types';
import { writable } from 'svelte/store';

export const availableRepositories: Option<string>[] = [
  {
    label: 'LangChain',
    value: 'https://github.com/hwchase17/langchain',
    version: 'v0.0.168'
  },
  {
    label: 'SuperGPT',
    value: 'https://github.com/cognitic-ai/SuperGPT',
    version: 'v0.0.1'
  }
];

function createSettingsStore() {
  const APIKeyFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('OPENAI_API_KEY')
      : '';

  const settings = writable<Settings>({
    openaiAPIKey: APIKeyFromLS || '',
    selectedRepo: availableRepositories[0]
  });

  function updateSettings(newValue: Settings) {
    settings.set(newValue);
  }

  return {
    subscribe: settings.subscribe,
    updateSettings
  };
}

export const settingsStore = createSettingsStore();
