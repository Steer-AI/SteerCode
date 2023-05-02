<script lang="ts">
  import { page } from '$app/stores';
  import Error from '$lib/shared/layout/Error.svelte';
  import ConversationWrapper from '$lib/features/ConversationThread/layout/Wrapper.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';

  $: agent = conversationsStore.getById($page.params.agentId);
</script>

<div class="flex h-full">
  {#if $agent}
    {#key $agent.value.id}
      <ConversationWrapper agent={$agent} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
