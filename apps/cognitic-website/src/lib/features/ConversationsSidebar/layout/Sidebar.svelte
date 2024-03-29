<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import ConversationButton, {
    type DispatchEvents
  } from '../components/ConversationButton.svelte';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import TwitterIcon from '$lib/shared/components/Icons/TwitterIcon.svelte';
  import DiscordIcon from '$lib/shared/components/Icons/DiscordIcon.svelte';
  import GitHubIcon from '$lib/shared/components/Icons/GitHubIcon.svelte';
  import { user } from '$lib/shared/stores/user';
  import { DEBUG_MODE } from '$lib/shared/utils/constants';
  import { onMount } from 'svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';

  export let open: boolean;

  let dialogEl: HTMLDialogElement;
  let conversationToDelete: Conversation | null = null;
  let fetching = false;
  let moreToFetch = false;

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
        conversationId: conversationToDelete.value.id
      });

      goto('/');
    }

    conversationToDelete = null;
  }

  async function fetchMoreConversations(nextPage: boolean) {
    if (fetching) return;
    fetching = true;
    const res = await conversationsStore.fetchFromServer(nextPage);
    moreToFetch = res.moreToFetch;
    fetching = false;
  }

  onMount(() => {
    fetchMoreConversations(false);
  });
</script>

<aside
  class="absolute bottom-0 top-0 z-10 flex md:relative {open
    ? 'left-0'
    : '-left-full'}"
  style={$$props.style}
>
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-6">
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

    <!-- scrollable list of chat sessions -->
    <section class="flex-1 overflow-y-scroll">
      {#if $user || DEBUG_MODE}
        <ul>
          {#each $conversationsStore as agent (agent.value.id)}
            <ConversationButton
              {agent}
              selected={$page.params.agentId === agent.value.id}
              on:delete={handleAgentDelete}
            />
          {/each}
        </ul>

        {#if moreToFetch}
          <div class="flex h-14 flex-shrink-0 items-center px-6">
            <Button
              variant="tertiary"
              class="w-full whitespace-nowrap"
              size="medium"
              on:click={() => fetchMoreConversations(true)}
              disabled={fetching}
            >
              {#if fetching}
                <Spinner class="h-4 w-4" />
              {:else}
                {$_('sidebar.loadMore')}
              {/if}
            </Button>
          </div>
        {/if}
      {:else}
        <div class="flex h-full items-center justify-center">
          <p class="body-regular text-content-primarySub px-6 text-center">
            {@html $_('sidebar.noUserMessage')}
          </p>
        </div>
      {/if}
    </section>

    <Divider />

    <span
      class="bg-background-primary text-content-secondary flex h-10 w-full items-center justify-center gap-6 px-6"
    >
      <a
        target="_blank"
        rel="noopener"
        href="https://twitter.com/SteerCode"
        class="hover:text-content-primary"
      >
        <TwitterIcon class="h-5 w-5" />
      </a>

      <a
        target="_blank"
        rel="noopener"
        href="https://discord.gg/4u6h5Wj6xr"
        class="hover:text-content-primary"
      >
        <DiscordIcon class="h-5 w-5" />
      </a>

      <a
        target="_blank"
        rel="noopener"
        href="https://github.com/Steer-AI/SteerCode"
        class="hover:text-content-primary"
      >
        <GitHubIcon class="h-4 w-4" />
      </a>
    </span>
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
    transition: left 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
</style>
