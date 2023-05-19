import type { Option } from '$lib/shared/components/Listbox/types';
import type { RepositoryOption } from './conversation.type';

export type Settings = {
  openaiAPIKey: string;
  selectedRepo: Option<RepositoryOption>;
  customBackendUrl: string;
  useCustomBackend: boolean;
};

export type ModalSettingsOptions = {
  openaiAPIKey: string;
  persistApiKey: boolean;
  customBackendUrl: string;
  useCustomBackend: boolean;
};
