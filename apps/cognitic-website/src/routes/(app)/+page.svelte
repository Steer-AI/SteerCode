<script lang="ts">
  import { onMount } from 'svelte';
  import NewConversationWrapper from './NewConversationWrapper.svelte';
  import { trackPage } from '$lib/core/services/tracking';

  onMount(() => {
    trackPage('New Conversation');
  });
</script>

<NewConversationWrapper />
