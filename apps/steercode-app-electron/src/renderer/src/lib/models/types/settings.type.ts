export type Settings = {
  openaiAPIKey: string;
  customBackendUrl: string;
  useCustomBackend: boolean;
};

export type ModalSettingsOptions = {
  openaiAPIKey: string;
  persistApiKey: boolean;
  customBackendUrl: string;
  useCustomBackend: boolean;
};

export type RemoteConfig = {
  stripe_user_portal_url: string;
  stripe_checkout_url: string;
};
