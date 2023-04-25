<script lang="ts">
  import { page } from '$app/stores';
  import ConversationMain from '$lib/features/ConversationThread/layout/ConversationMain.svelte';
  import TaskSidebar from '$lib/features/ConversationThread/layout/TaskSidebar.svelte';
  import { conversationsStore } from '$lib/features/ConversationsSidebar/stores/conversations';
  import Error from '$lib/shared/layout/Error.svelte';

  $: conversation = conversationsStore.getById($page.params.conversationId);
</script>

<div class="flex min-h-full">
  {#if $conversation}
    <TaskSidebar conversation={$conversation} />
    <ConversationMain conversation={$conversation} />
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
