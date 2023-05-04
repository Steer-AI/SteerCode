import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';
import type {
  ChatMessageDTO,
  ConversationDTO,
  NewConversationDTO
} from '$lib/models/types/conversation.type';

export async function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<boolean> {
  return responseWithErrorHandeling<boolean>(
    customFetch(`/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    false,
    `Failed to delete message ${messageId} from conversation ${conversationId}`
  );
}

export async function getMessages(
  conversationId: string
): Promise<ChatMessageDTO[]> {
  return responseWithErrorHandeling<ChatMessageDTO[]>(
    customFetch(`/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    [],
    `Failed to get messages for conversation ${conversationId}`
  );
}

export async function addConversation(
  conversation: NewConversationDTO
): Promise<ConversationDTO | null> {
  const resp = await responseWithErrorHandeling<ConversationDTO | null>(
    customFetch('/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(conversation)
    }),
    null,
    'Failed to add conversation'
  );
  return resp;
}

export async function deleteConversation(
  conversationId: string
): Promise<boolean> {
  return responseWithErrorHandeling<boolean>(
    customFetch(`/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    false,
    'Failed to delete conversation'
  );
}

export async function getConversation(
  conversationId: string
): Promise<ConversationDTO | null> {
  return await responseWithErrorHandeling<ConversationDTO | null>(
    customFetch(`/chat/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    null,
    'Failed to get conversation'
  );
}

export async function getAllConversations(
  limit: number = 0,
  offset: number = 0
): Promise<ConversationDTO[]> {
  const resp = await responseWithErrorHandeling<ConversationDTO[]>(
    customFetch(`/chat/conversations?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    [],
    'Failed to get conversations'
  );

  return resp.map((conversation) => {
    if (!conversation.messages) {
      conversation.messages = [];
    }
    return conversation;
  });
}
