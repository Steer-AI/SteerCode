import type { Settings } from '$lib/models/types/settings.type';
import type { Option } from '$lib/shared/components/Listbox/types';
import { writable } from 'svelte/store';

export const availableRepositories: Option<string>[] = [
  { label: 'LangChain', value: 'https://github.com/hwchase17/langchain' },
  { label: 'SuperGPT', value: 'https://github.com/cognitic-ai/SuperGPT' }
];

function createSettingsStore() {
  const APIKeyFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('OPENAI_API_KEY')
      : '';

  const settings = writable<Settings>({
    openaiAPIKey: APIKeyFromLS || '',
    openaiModel: 'gpt-3.5-turbo',
    temperature: 0.3,
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
