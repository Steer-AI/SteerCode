import { Log } from '$lib/core/services/logging';
import type { Settings } from '$lib/models/types/settings.type';
import { localStorageWritable } from '$lib/shared/stores/localStorageStore';
import { derived, writable, type Readable } from 'svelte/store';

function createSettingsStore() {
  let currentSettingsValue: Settings = {
    openaiAPIKey: '',
    customBackendUrl: '',
    useCustomBackend: false,
    selectedRepo: null
  };

  const stringValueSerialiser = {
    parse: (text: string) => text,
    stringify: (object: string) => object
  };

  const settingStores = {
    openaiAPIKey: localStorageWritable(
      'cognitic.openAiAPIKey',
      currentSettingsValue.openaiAPIKey,
      { serializer: stringValueSerialiser }
    ),
    customBackendUrl: localStorageWritable(
      'cognitic.customBackendUrl',
      currentSettingsValue.customBackendUrl,
      { serializer: stringValueSerialiser }
    ),
    useCustomBackend: localStorageWritable(
      'cognitic.useCustomBackend',
      currentSettingsValue.useCustomBackend
    ),
    selectedRepo: writable(currentSettingsValue.selectedRepo)
  };

  type StoreKeys = keyof typeof settingStores;

  function updateSettings(newValue: Partial<Settings>) {
    Object.entries(newValue).forEach(([key, value]) => {
      const store = settingStores[key as StoreKeys];
      if (!store) {
        Log.WARNING(`Unknown setting ${key}`);
        return;
      }
      Log.DEBUG(`Updating settings.${key}`, value);
      store.set(value);
    });
  }

  const settings: Readable<Settings> = derived(
    [
      settingStores.openaiAPIKey,
      settingStores.customBackendUrl,
      settingStores.useCustomBackend,
      settingStores.selectedRepo
    ],
    ($) => {
      return {
        openaiAPIKey: $[0],
        customBackendUrl: $[1],
        useCustomBackend: $[2],
        selectedRepo: $[3]
      };
    }
  );

  settings.subscribe((value) => {
    Log.DEBUG('Settings', value);
    currentSettingsValue = value;
  });

  return {
    subscribe: settings.subscribe,
    updateSettings,
    getValue: () => currentSettingsValue
  };
}

export const settingsStore = createSettingsStore();
