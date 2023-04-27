<script lang="ts">
  import { AGENT_MODE } from '$lib/shared/utils/constants';
  import NewAgentWrapper from './NewAgentWrapper.svelte';
  import NewConversationWrapper from './NewConversationWrapper.svelte';
</script>

{#if AGENT_MODE}
  <NewAgentWrapper />
{:else}
  <NewConversationWrapper />
{/if}
```
