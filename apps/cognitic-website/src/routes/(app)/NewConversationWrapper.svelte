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
  import Button from '$lib/shared/components/Button.svelte';

  // form variables
  let pendingRequest = false;

  let pendingContent = '';

  async function handleSubmit(query: string) {
    if (pendingRequest) return;
    pendingRequest = true;
    pendingContent = query;
    Log.DEBUG('NewConversation.handleSubmit', query);
    const settings = get(settingsStore);
    const repository = {
      url: settings.selectedRepo.value,
      name: settings.selectedRepo.label,
      version: settings.selectedRepo.version
    };
    const toAdd: NewConversationDTO = {
      content: query,
      repository
    };
    const agent = await conversationsStore.add(toAdd);
    pendingRequest = false;
    if (!agent) return;
    trackEvent('Create conversation', {
      message: query,
      conversationId: agent.value.id,
      repository_name: repository.name,
      repository_version: repository.version
    });
    goto(`/chat/${agent.value.id}`);

    setTimeout(() => {
      // refetch after 10s to get a conversation title
      conversationsStore.fetchById(agent.value.id);
    }, 10_000);
  }
</script>

<ConversationWrapper
  on:submit={(e) => handleSubmit(e.detail)}
  loading={pendingRequest}
>
  <ChatMessage
    type="system"
    message={$_('conversation.message.initialMessage')}
  >
    <div class="flex flex-col flex-wrap items-center gap-3 lg:flex-row">
      <Button
        variant="tertiary"
        size="medium"
        on:click={() => {
          handleSubmit($_('conversation.message.example1'));
        }}
      >
        <span class="bod-small-plus text-content-primary">
          {$_('conversation.message.example1')}
        </span>
      </Button>
      <Button
        variant="tertiary"
        size="medium"
        on:click={() => {
          handleSubmit($_('conversation.message.example2'));
        }}
      >
        <span class="bod-small-plus text-content-primary">
          {$_('conversation.message.example2')}
        </span>
      </Button>
      <Button
        variant="tertiary"
        size="medium"
        on:click={() => {
          handleSubmit($_('conversation.message.example3'));
        }}
      >
        <span class="bod-small-plus text-content-primary">
          {$_('conversation.message.example3')}
        </span>
      </Button>
    </div>
  </ChatMessage>
  {#if pendingContent}
    <ChatMessage type="user" message={pendingContent} deletable={false} />
  {/if}
</ConversationWrapper>
