import { trackPage } from '$lib/core/services/tracking';
import { conversationsStore } from '$lib/shared/stores/conversations';

export function load({ params }) {
  trackPage('Conversation', { conversationId: params.chatId });
  conversationsStore.fetchById(params.chatId);
  return {};
}
