import type { RepositoryOption } from './conversation.type';

export type Settings = {
  openaiAPIKey: string;
  selectedRepo: RepositoryOption | null;
  customBackendUrl: string;
  useCustomBackend: boolean;
};

export type ModalSettingsOptions = {
  openaiAPIKey: string;
  persistApiKey: boolean;
  customBackendUrl: string;
  useCustomBackend: boolean;
};
