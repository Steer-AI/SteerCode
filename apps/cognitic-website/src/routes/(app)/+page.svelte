<script lang="ts">
  import { AGENT_MODE } from '$lib/shared/utils/constants';
  import { onMount } from 'svelte';
  import NewAgentWrapper from './NewAgentWrapper.svelte';
  import NewConversationWrapper from './NewConversationWrapper.svelte';
  import { trackPage } from '$lib/core/services/tracking';

  onMount(() => {
    trackPage('New Agent');
  });
</script>

{#if AGENT_MODE}
  <NewAgentWrapper />
{:else}
  <NewConversationWrapper />
{/if}
```
