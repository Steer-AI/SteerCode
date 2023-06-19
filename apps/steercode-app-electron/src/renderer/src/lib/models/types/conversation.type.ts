export type RepositoryOption = {
  name: string;
  url: string;
  version?: string;
  branch?: string;
  last_update?: string; // iso datetime string
  description?: string;
  selected?: boolean;
};

// Model used to create a new agent
export type NewConversationDTO = {
  content: string;
  repository: RepositoryOption;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  uid?: string;
  title: string;
  repository: RepositoryOption;
  messages: Array<ChatMessageDTO>;
  created_at: string; // datetime string;
};

export type ChatMessageDTO = {
  id: string; // uuidv4
  conversation_id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  created_at: string; // datetime string;
  user_feedback: string | null;
  metadata?: {
    files?: string[];
  };
};

export type ChatMode = 'chat' | 'code' | 'debug' | 'explain' | 'tech_stack';

export type CompletionResponse = {
  msg: string;
  error: boolean;
  done?: boolean;
  id?: string;
  metadata?: ChatMessageDTO['metadata'];
};
