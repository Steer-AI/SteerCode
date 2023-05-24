<script lang="ts">
  import { page } from '$app/stores';
  import Error from '$lib/shared/layout/Error.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import ChatThreadInner from '$lib/features/ConversationThread/layout/ChatThreadInner.svelte';
  import Sidebar from '$lib/features/CodebaseSidebar/layout/Sidebar.svelte';

  $: conversation = conversationsStore.getById($page.params.chatId);
</script>

<div class="flex h-full">
  {#if $conversation}
    {#key $conversation.value.id}
      <ChatThreadInner conversation={$conversation} />
      <Sidebar conversation={$conversation} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
