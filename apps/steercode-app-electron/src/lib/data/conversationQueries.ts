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

export async function updateFeedback(
  conversationId: string,
  messageId: string,
  feedback: string
): Promise<boolean> {
  return responseWithErrorHandeling<boolean>(
    customFetch(`/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ feedback })
    }),
    false,
    `Failed to update message ${messageId} from conversation ${conversationId}`
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

const promiseCache = new Map<string, Promise<ConversationDTO[]>>();
export async function getAllConversations(
  opt: { limit?: number; offset?: number; projectUrl?: string } = {}
): Promise<ConversationDTO[]> {
  const url = `/chat/conversations?limit=${opt.limit || 10}&offset=${
    opt.offset || 0
  }${
    opt.projectUrl ? `&project_url=${encodeURIComponent(opt.projectUrl)}` : ''
  }`;

  if (promiseCache.has(url)) {
    return await promiseCache.get(url)!;
  }

  const fetchPromise = (async () => {
    const resp = await responseWithErrorHandeling<ConversationDTO[]>(
      customFetch(url, {
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
  })();

  promiseCache.set(url, fetchPromise);
  const resp = await fetchPromise;
  promiseCache.delete(url);
  return resp;
}
