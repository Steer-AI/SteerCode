import type { CreateChatCompletionRequest } from 'openai';

export type Settings = {
  // TODO: implement model
  openaiAPIKey: string | null;
  openaiModel: CreateChatCompletionRequest['model'];
  temperature: number;
};
