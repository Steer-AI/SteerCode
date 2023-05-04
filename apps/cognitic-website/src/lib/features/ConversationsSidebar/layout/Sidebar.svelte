<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { modalOpen } from '$lib/features/SettingsModal/stores/modal';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import SettingsIcon from '$lib/shared/components/Icons/SettingsIcon.svelte';
  import ConversationButton, {
    type DispatchEvents
  } from '../components/ConversationButton.svelte';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { onMount } from 'svelte';

  let dialogEl: HTMLDialogElement;
  let conversationToDelete: Conversation | null = null;

  function handleAgentDelete(e: CustomEvent<DispatchEvents['delete']>) {
    conversationToDelete = e.detail.agent;
    dialogEl.showModal();
  }

  function handleConfirmClose() {
    if (conversationToDelete === null) {
      return;
    }

    if (dialogEl.returnValue === 'confirm') {
      conversationsStore.remove(conversationToDelete.value.id);

      trackEvent('Delete Conversation', {
        goal: conversationToDelete.value.goal,
        conversationId: conversationToDelete.value.id
      });

      goto('/');
    }

    conversationToDelete = null;
  }

  onMount(() => {
    conversationsStore.fetchFromServer();
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
        {$_('sidebar.newAgent')}
      </Button>
    </div>

    <Divider />

    <!-- scrollable list of chat sessions -->
    <section class="flex-1 overflow-y-scroll">
      <ul class="my-2">
        {#each $conversationsStore as agent (agent.value.id)}
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
        {$_('sidebar.settings')}
      </Button>
    </div>
  </div>

  <Divider vertical />
</aside>

<ActionModal
  bind:dialogEl
  title={$_('sidebar.deleteConfirmationDialog.title')}
  description="{$_(
    'sidebar.deleteConfirmationDialog.description'
  )} <br/> <b style='margin-top: 8px'>{conversationToDelete?.value?.title ||
    ''}</b>"
  confirmText={$_('sidebar.deleteConfirmationDialog.confirmButton')}
  cancelText={$_('sidebar.deleteConfirmationDialog.cancelButton')}
  class="max-w-sm"
  on:close={handleConfirmClose}
/>

<style lang="postcss">
  aside {
    transition: width 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
</style>
