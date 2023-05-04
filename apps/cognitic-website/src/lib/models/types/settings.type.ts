import type { Option } from '$lib/shared/components/Listbox/types';
import type { CreateChatCompletionRequest } from 'openai';

export type Settings = {
  openaiAPIKey: string;
  openaiModel: CreateChatCompletionRequest['model'];
  temperature: number;
  selectedRepo: Option<string>;
};
