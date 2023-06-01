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
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import {
    initialFileTreeFile,
    selectedRepositoryStore
  } from '$lib/shared/stores/selectedRepository';
  import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';
  import type { IFileTreeItem } from 'cognitic-models';

  // form variables
  let pendingRequest = false;

  let pendingContent = '';

  async function addFileToContext(fileName: string) {
    let item: IFileTreeItem | null = null;

    $initialFileTreeFile?.children?.forEach((child) => {
      if (child.fileName.toLowerCase().endsWith(fileName.toLowerCase())) {
        item = child;
      }
    });

    if (item) {
      selectedEntities.add(item);
      return;
    }
  }

  async function handleSubmit(query: string) {
    const settings = get(settingsStore);

    if ($selectedRepositoryStore === null) {
      Log.ERROR('NewConversation.handleSubmit', 'No repository selected');
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: $_('notifications.noRepoSelected'),
        position: Position.BottomRight
      });
      return;
    }

    if (pendingRequest) return;
    pendingRequest = true;
    pendingContent = query;
    Log.DEBUG('NewConversation.handleSubmit', query);
    const toAdd: NewConversationDTO = {
      content: query,
      repository: $selectedRepositoryStore
    };
    const agent = await conversationsStore.add(toAdd);
    pendingRequest = false;
    if (!agent) return;
    trackEvent('Create conversation', {
      message: query,
      conversationId: agent.value.id
    });
    goto(`/chat?id=${agent.value.id}`);

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
    <div class="mt-20 flex flex-col flex-wrap items-center gap-3 lg:flex-row">
      <Button
        variant="tertiary"
        size="medium"
        class="mt-3"
        on:click={() => {
          addFileToContext('.gitignore');
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
        class="mt-3"
        on:click={() => {
          addFileToContext('README.md');
          handleSubmit($_('conversation.message.example2'));
        }}
      >
        <span class="bod-small-plus text-content-primary">
          {$_('conversation.message.example2')}
        </span>
      </Button>
    </div>
  </ChatMessage>
  {#if pendingContent}
    <ChatMessage type="user" message={pendingContent} deletable={false} />
  {/if}
</ConversationWrapper>
