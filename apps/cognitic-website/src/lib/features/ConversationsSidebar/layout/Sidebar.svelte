<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import SessionButton, {
    type DispatchEvents
  } from '../components/SessionButton.svelte';
  import { conversationsStore } from '../stores/conversations';

  function handleSessionDelete(e: CustomEvent<DispatchEvents['delete']>) {
    conversationsStore.remove(e.detail.conversationId);
  }
</script>

<aside class="flex" style={$$props.style}>
  <span class="bg-background-secondary flex w-64 flex-col">
    <div class="mx-3 flex h-14 flex-shrink-0 items-center">
      <Button variant="secondary" class="w-full" size="medium">
        <PlusIcon class="mr-1 h-3 w-3" />
        New Session
      </Button>
    </div>

    <Divider />

    <!-- scrollable list of chat sessions -->
    <section class="flex-1 overflow-y-scroll">
      <ul class="my-2">
        {#each $conversationsStore as conversation (conversation.id)}
          <SessionButton
            {conversation}
            selected={$page.params.conversationId === conversation.id}
            on:delete={handleSessionDelete}
          />
        {/each}
      </ul>
    </section>

    <Divider />

    <!-- Buttons + other info -->
    <div class="mx-3 flex h-14 flex-shrink-0 items-center">
      <Button variant="tertiary" class="w-full" size="medium">
        <SettingsIcon class="mr-1 h-3 w-3" />
        Settings
      </Button>
    </div>
  </span>

  <Divider vertical />
</aside>
