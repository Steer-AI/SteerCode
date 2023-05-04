<script lang="ts">
  import { page } from '$app/stores';
  import Error from '$lib/shared/layout/Error.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import ChatThreadInner from '$lib/features/ConversationThread/layout/ChatThreadInner.svelte';

  $: agent = conversationsStore.getById($page.params.agentId);
</script>

<div class="flex h-full">
  {#if $agent}
    {#key $agent.value.id}
      <ChatThreadInner agent={$agent} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
