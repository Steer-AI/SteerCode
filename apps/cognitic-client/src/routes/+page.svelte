<script lang="ts">
  import Header from '$lib/shared/layout/Header.svelte';
  import ConversationLanding from './ConversationLanding.svelte';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';

  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';
  import { browser } from '$app/environment';

  let sidebarOpen = browser ? window.innerWidth > 768 : true;
  let unsub: Unsubscriber;
  onMount(() => {
    let lastSelectedRepoUrl: string | null = null;
    unsub = selectedRepositoryStore.subscribe((selectedRepo) => {
      if (lastSelectedRepoUrl === selectedRepo?.url) return;
      lastSelectedRepoUrl = selectedRepo?.url || null;
      conversationsStore.fetchFromServer(selectedRepo?.url);
    });
  });
  onDestroy(() => {
    unsub && unsub();
  });
</script>

<Header style="max-width: 100vw" bind:sidebarOpen />
<div>
  <ConversationLanding />
</div>

<SettingsModal />
