import type { CreateChatCompletionRequest } from 'openai';

export type Settings = {
  openaiAPIKey: string;
  openaiModel: CreateChatCompletionRequest['model'];
  temperature: number;
};
