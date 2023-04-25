<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import { modalOpen } from '$lib/features/SettingsModal/stores/modal';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import { onMount } from 'svelte';
  import SessionButton, {
    type DispatchEvents
  } from '../components/SessionButton.svelte';
  import { conversationsStore } from '../stores/conversations';

  function handleSessionDelete(e: CustomEvent<DispatchEvents['delete']>) {
    conversationsStore.remove(e.detail.conversationId);
    goto('/');
  }

  onMount(() => {
    // TODO: refetch if user log in
    conversationsStore.fetchFromServer();
  });
</script>

<aside class="flex {$$props.class}" style={$$props.style}>
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-3">
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
      <Button
        variant="tertiary"
        class="w-full"
        size="medium"
        on:click={() => modalOpen.set(true)}
      >
        <SettingsIcon class="mr-1 h-3 w-3" />
        Settings
      </Button>
    </div>
  </div>

  <Divider vertical />
</aside>

<style lang="postcss">
  aside {
    transition: width 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
</style>
