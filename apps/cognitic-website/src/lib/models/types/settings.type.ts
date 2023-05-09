import type { Option } from '$lib/shared/components/Listbox/types';

export type Settings = {
  openaiAPIKey: string;
  selectedRepo: Option<string>;
};
