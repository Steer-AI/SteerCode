<script lang="ts">
  import { page } from '$app/stores';
  import ConversationMain from '$lib/features/ConversationThread/layout/ConversationMain.svelte';
  import TaskSidebar from '$lib/features/ConversationThread/layout/TaskSidebar.svelte';
  import { agentStore } from '$lib/shared/stores/agents';
  import Error from '$lib/shared/layout/Error.svelte';

  $: agent = agentStore.getById($page.params.agentId);
</script>

<div class="flex h-full">
  {#if $agent}
    {#key $agent.value.id}
      <TaskSidebar agent={$agent} />
      <ConversationMain agent={$agent} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
