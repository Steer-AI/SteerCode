import { trackPage } from '$lib/core/services/tracking';
import { conversationsStore } from '$lib/shared/stores/conversations';

export function load({ params }) {
  trackPage('Conversation', { conversationId: params.agentId });
  conversationsStore.fetchById(params.agentId);
  return {};
}
