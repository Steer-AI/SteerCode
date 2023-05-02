<script lang="ts">
  import { goto } from '$app/navigation';
  import { Log } from '$lib/core/services/logging';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import SearchIcon from '$lib/shared/components/Icons/SearchIcon.svelte';
  import ChatMessage from '$lib/features/ConversationThread/components/ChatMessage.svelte';

  let query: string = '';

  // form variables
  let pendingRequest = false;

  async function handleSubmit(e: Event) {
    if (pendingRequest) return;
    pendingRequest = true;
    Log.DEBUG('NewConversation.handleSubmit', query);
    const agent = await conversationsStore.add({
      message: query
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

<section class="flex h-full w-full flex-col items-center">
  <div class="flex h-14 w-full items-center justify-between px-6">
    <h3 class="text-content-secondary headline-small" />

    <Button variant="tertiary" size="medium" disabled={true}>
      {$_('conversation.clearButton')}
    </Button>
  </div>
  <Divider class="w-full" />

  <div
    class="mt-4 flex w-full flex-1 flex-col-reverse gap-4 overflow-y-auto px-6"
  >
    <div class="flex flex-col gap-2">
      <ChatMessage
        senderName={'SuperGPT'}
        type="assistant"
        message={$_('conversation.message.initialMessage')}
      />
    </div>
  </div>

  <form
    class="flex w-full flex-shrink-0 items-end gap-4 px-6 py-2"
    on:submit|preventDefault={handleSubmit}
  >
    <TextAreaField
      placeholder={$_('conversation.messageInput.placeholder')}
      labelClass="flex-1 flex justify-end"
      class="w-full p-3"
      style="min-height: 24px; max-height: 256px;"
      maxlength={3000}
      rows={1}
      bind:value={query}
      on:input={(e) => {
        e.target.style.height = 0;
        e.target.style.height = e.target.scrollHeight + 'px';
      }}
      on:keydown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !pendingRequest) {
          e.preventDefault();
          handleSubmit(e);
        }
      }}
    />

    <Button
      variant="primary"
      type="submit"
      size="medium"
      class="w-24"
      disabled={pendingRequest}
    >
      <SearchIcon class="mr-2 h-4 w-4" />
      {$_('conversation.sendButton')}
    </Button>
  </form>
</section>
