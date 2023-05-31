<script lang="ts">
  import { browser } from '$app/environment';
  import ConversationsSidebar from '$lib/features/ConversationsSidebar/layout/Sidebar.svelte';
  import CodebaseSidebar from '$lib/features/CodebaseSidebar/layout/Sidebar.svelte';
  import FilePreviewSidebar from '$lib/features/FilePreviewSidebar/layout/Sidebar.svelte';

  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import Header from '$lib/shared/layout/Header.svelte';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';

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

<div class="main-template">
  <Header style="max-width: 100vw" bind:sidebarOpen />

  <div class="relative isolate flex overflow-hidden">
    <ConversationsSidebar open={sidebarOpen} />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>

    <CodebaseSidebar />
    <FilePreviewSidebar />
  </div>
</div>

<SettingsModal />

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-rows: min-content 1fr min-content;
  }
</style>
