import type { ChatCompletionRequestMessage } from 'openai';

// Model used to create a new agent
export type NewConversationDTO = {
  message: string;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  name: string;
  messages: ChatCompletionRequestMessage[];
};
