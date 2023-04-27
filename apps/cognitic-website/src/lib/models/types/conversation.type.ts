import type { ChatCompletionRequestMessage } from 'openai';

// Model used to create a new agent
export type NewConversationDTO = {
  name: string;
  system_prompt: string;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  name: string;
  system_prompt: string;
  messages: ChatCompletionRequestMessage[];
};
