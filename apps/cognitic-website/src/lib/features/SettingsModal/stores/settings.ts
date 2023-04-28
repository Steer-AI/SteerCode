import type { Settings } from '$lib/models/types/settings.type';
import { writable } from 'svelte/store';

function createSettingsStore() {
  const APIKeyFromLS =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('OPENAI_API_KEY')
      : '';

  const settings = writable<Settings>({
    openaiAPIKey: APIKeyFromLS || '',
    openaiModel: 'gpt-3.5-turbo',
    temperature: 0.9
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
