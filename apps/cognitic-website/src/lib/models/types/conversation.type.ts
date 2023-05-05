import type { ChatCompletionRequestMessageRoleEnum } from 'openai';

// Model used to create a new agent
export type NewConversationDTO = {
  content: string;
  repository_name: string;
  repository_url: string;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  title: string;
  repository_name: string;
  repository_url: string;
  messages: Array<ChatMessageDTO>;
  created_at: string; // datetime string;
};

export type ChatMessageDTO = {
  id: string; // uuidv4
  conversation_id: string;
  content: string;
  role: ChatCompletionRequestMessageRoleEnum;
  created_at: string; // datetime string;
};
