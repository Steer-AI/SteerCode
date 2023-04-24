<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import { conversationsStore } from '$lib/features/ConversationsSidebar/stores/conversations';
  import type { Conversation } from '$lib/models/types/conversation.type';

  let conversation: Conversation;

  afterNavigate((navigation) => {
    console.log('afterNavigate', navigation);
    const conversationId = navigation.to?.params?.conversationId;
    if (!conversationId) {
      goto('/'); // TODO: redirect to create new conversation
      return;
    }
    const _c = conversationsStore.getById(conversationId);
    if (!_c) {
      goto('/'); // TODO: redirect to create new conversation
      return;
    }
    conversation = _c;
  });
</script>

{#if conversation}
  <section>
    CONVERSATION {conversation.name}
  </section>
{/if}
