import { Log } from '$lib/core/services/logging';
import type { RepositoryOption } from '$lib/models/types/conversation.type';
import type { Settings } from '$lib/models/types/settings.type';
import type { Option } from '$lib/shared/components/Listbox/types';
import { localStorageWritable } from '$lib/shared/stores/localStorageStore';
import { derived, writable, type Readable } from 'svelte/store';

function createSettingsStore() {
  const DEFAULT_REPOSITORIES: Option<RepositoryOption>[] = [
    {
      label: 'LangChain',
      value: {
        branch: "master",
        clone_url: "git@github.com:hwchase17/langchain.git",
        name: "LangChain",
        repo_id: "hwchase17_langchain",
        repo_name: null,
        repo_path: "/app/codebases/hwchase17_langchain",
        url: "https://github.com/hwchase17/langchain",
        version: "v0.0.173"
      }
    }
  ];
  
  const availableRepositories =
    writable<Option<RepositoryOption>[]>(DEFAULT_REPOSITORIES);

  let currentSettingsValue: Settings = {
    openaiAPIKey: '',
    customBackendUrl: '',
    useCustomBackend: false,
    selectedRepo: DEFAULT_REPOSITORIES[0],
  };

  const stringValueSerialiser = {
    parse: (text: string) => text,
    stringify: (object: string) => object
  };

  const settingStores = {
    openaiAPIKey: localStorageWritable('cognitic.openAiAPIKey', currentSettingsValue.openaiAPIKey, { serializer: stringValueSerialiser }),
    customBackendUrl: localStorageWritable('cognitic.customBackendUrl', currentSettingsValue.customBackendUrl, { serializer: stringValueSerialiser }),
    useCustomBackend: localStorageWritable('cognitic.useCustomBackend', currentSettingsValue.useCustomBackend),
    selectedRepo: writable(currentSettingsValue.selectedRepo)
  }

  type StoreKeys = keyof typeof settingStores;

  function updateSettings(newValue: Partial<Settings>) {
    Object.entries(newValue).forEach(([key, value]) => {
      const store = settingStores[key as StoreKeys];
      if (!store) {
        Log.WARNING(`Unknown setting ${key}`);
        return;
      }
      Log.DEBUG(`Updating settings.${key}`, value)
      store.set(value);
    });
  }

  const settings: Readable<Settings> = derived([
    settingStores.openaiAPIKey,
    settingStores.customBackendUrl,
    settingStores.useCustomBackend,
    settingStores.selectedRepo
  ], ($) => {
    return {
      openaiAPIKey: $[0],
      customBackendUrl: $[1],
      useCustomBackend: $[2],
      selectedRepo: $[3]
    }
  });

  settings.subscribe((value) => {
    Log.DEBUG('Settings', value);
    currentSettingsValue = value;
  });

  return {
    subscribe: settings.subscribe,
    updateSettings,
    availableRepositories,
    getValue: () => currentSettingsValue
  };
}

export const settingsStore = createSettingsStore();
