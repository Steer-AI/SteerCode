<script lang="ts">
  import Error from '$lib/shared/layout/Error.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import ChatThreadInner from '$lib/features/ConversationThread/layout/ChatThreadInner.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: conversation = conversationsStore.getById(data.id);
</script>

<div class="flex h-full">
  {#if $conversation}
    {#key $conversation.value.id}
      <ChatThreadInner conversation={$conversation} />
    {/key}
  {:else}
    <Error status="404" summary="Conversation not found" />
  {/if}
</div>
