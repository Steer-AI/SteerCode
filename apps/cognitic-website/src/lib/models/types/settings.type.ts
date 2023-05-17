import type { Option } from '$lib/shared/components/Listbox/types';

export type Settings = {
  openaiAPIKey: string;
  selectedRepo: Option<string>;
  customBackendUrl: string;
};

export type ModalSettingsOptions = {
  openaiAPIKey: string;
  persistApiKey: boolean;
  customBackendUrl: string;
};
