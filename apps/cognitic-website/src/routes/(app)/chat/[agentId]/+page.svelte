<script lang="ts">
  import { page } from '$app/stores';
  import { agentStore } from '$lib/shared/stores/agents';
  import Error from '$lib/shared/layout/Error.svelte';
  import ConversationWrapper from '$lib/features/ConversationThread/layout/Wrapper.svelte';
  import AgentWrapper from '$lib/features/AgentThread/layout/Wrapper.svelte';
  import type { DataStore } from '$lib/models/types/store.type';
  import { AGENT_MODE } from '$lib/shared/utils/constants';
  import { conversationsStore } from '$lib/shared/stores/conversations';

  const _store: DataStore = AGENT_MODE ? agentStore : conversationsStore;

  const component = AGENT_MODE ? AgentWrapper : ConversationWrapper;

  $: agent = _store.getById($page.params.agentId);
</script>

<div class="flex h-full">
  {#if $agent}
    {#key $agent.value.id}
      <svelte:component this={component} agent={$agent} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
