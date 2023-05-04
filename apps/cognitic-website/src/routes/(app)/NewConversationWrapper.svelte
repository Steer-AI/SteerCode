<script lang="ts">
  import { goto } from '$app/navigation';
  import { Log } from '$lib/core/services/logging';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from '$lib/features/ConversationThread/layout/Wrapper.svelte';
  import ChatMessage from '$lib/features/ConversationThread/components/ChatMessage.svelte';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';

  // form variables
  let pendingRequest = false;

  let pendingContent = '';

  async function handleSubmit(query: string) {
    if (pendingRequest) return;
    pendingRequest = true;
    pendingContent = query;
    Log.DEBUG('NewConversation.handleSubmit', query);
    const agent = await conversationsStore.add({
      content: query,
      repository: $settingsStore.selectedRepo.value
    });
    pendingRequest = false;
    if (!agent) return;
    trackEvent('Create conversation', {
      message: query,
      conversationId: agent.value.id
    });
    goto(`/chat/${agent.value.id}`);
  }
</script>

<ConversationWrapper
  agentName={'Cognitic'}
  on:submit={(e) => handleSubmit(e.detail)}
  loading={pendingRequest}
>
  {#if pendingContent}
    <ChatMessage
      senderName={'ME'}
      type="user"
      message={pendingContent}
      deletable={false}
    />
  {/if}
</ConversationWrapper>
