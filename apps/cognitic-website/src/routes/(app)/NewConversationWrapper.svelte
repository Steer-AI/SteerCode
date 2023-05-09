<script lang="ts">
  import { goto } from '$app/navigation';
  import { Log } from '$lib/core/services/logging';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from '$lib/features/ConversationThread/layout/Wrapper.svelte';
  import ChatMessage from '$lib/features/ConversationThread/components/ChatMessage.svelte';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import type { NewConversationDTO } from '$lib/models/types/conversation.type';
  import { get } from 'svelte/store';

  // form variables
  let pendingRequest = false;

  let pendingContent = '';

  async function handleSubmit(query: string) {
    if (pendingRequest) return;
    pendingRequest = true;
    pendingContent = query;
    Log.DEBUG('NewConversation.handleSubmit', query);
    const settings = get(settingsStore);
    const toAdd: NewConversationDTO = {
      content: query,
      repository_url: settings.selectedRepo.value,
      repository_name: settings.selectedRepo.label
    };
    const agent = await conversationsStore.add(toAdd);
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
  on:submit={(e) => handleSubmit(e.detail)}
  loading={pendingRequest}
>
  {#if pendingContent}
    <ChatMessage type="user" message={pendingContent} deletable={false} />
  {/if}
</ConversationWrapper>
