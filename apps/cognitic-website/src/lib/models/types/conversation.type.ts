import type { ChatCompletionRequestMessageRoleEnum } from 'openai';

// Model used to create a new agent
export type NewConversationDTO = {
  content: string;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  title: string;
  messages: Array<{
    content: string;
    role: ChatCompletionRequestMessageRoleEnum;
    created_at: string; // datetime string;
  }>;
  created_at: string; // datetime string;
};
