<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { modalOpen } from '$lib/features/SettingsModal/stores/modal';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import { onMount } from 'svelte';
  import ConversationButton, {
    type DispatchEvents
  } from '../components/ConversationButton.svelte';
  import { agentStore } from '$lib/shared/stores/agents';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import type { Agent } from '$lib/models/classes/Agent.class';
  import type { DataStore } from '$lib/models/types/store.type';
  import { AGENT_MODE } from '$lib/shared/utils/constants';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';

  const store: DataStore = AGENT_MODE ? agentStore : conversationsStore;

  let dialogEl: HTMLDialogElement;
  let agentToDelete: Agent | null = null;

  function handleAgentDelete(e: CustomEvent<DispatchEvents['delete']>) {
    agentToDelete = e.detail.agent;
    dialogEl.showModal();
  }

  function handleConfirmClose() {
    if (agentToDelete === null) {
      return;
    }

    if (dialogEl.returnValue === 'confirm') {
      store.remove(agentToDelete.value.id);

      trackEvent('Delete Conversation', {
        goal: agentToDelete.value.goal,
        conversationId: agentToDelete.value.id
      });

      goto('/');
    }

    agentToDelete = null;
  }

  onMount(() => {
    // TODO: refetch if user log in
    store.fetchFromServer();
  });
</script>

<aside class="flex {$$props.class}" style={$$props.style}>
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <Button
        variant="secondary"
        class="w-full whitespace-nowrap"
        size="medium"
        as="a"
        href="/"
        on:click={() => {
          trackEvent('New conversation');
        }}
      >
        <PlusIcon class="mr-1 h-3 w-3" />
        New Session
      </Button>
    </div>

    <Divider />

    <!-- scrollable list of chat sessions -->
    <section class="flex-1 overflow-y-scroll">
      <ul class="my-2">
        {#each $store as agent (agent.value.id)}
          <ConversationButton
            {agent}
            selected={$page.params.agentId === agent.value.id}
            on:delete={handleAgentDelete}
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
        on:click={() => {
          modalOpen.set(true);
          trackEvent('Open settings');
        }}
      >
        <SettingsIcon class="mr-1 h-3 w-3" />
        Settings
      </Button>
    </div>
  </div>

  <Divider vertical />
</aside>

<ActionModal
  bind:dialogEl
  title="Delete {AGENT_MODE ? 'Agent' : 'Conversation'}?"
  description="Confirm you want to delete following {AGENT_MODE
    ? 'agent'
    : 'conversation'}: <br/> <b style='margin-top: 8px'>{agentToDelete?.value
    ?.name || ''}</b>"
  confirmText="Yes"
  cancelText="No"
  class="max-w-sm"
  on:close={handleConfirmClose}
/>

<style lang="postcss">
  aside {
    transition: width 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
</style>
