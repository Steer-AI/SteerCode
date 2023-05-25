<script lang="ts">
  import { browser } from '$app/environment';
  import ConversationsSidebar from '$lib/features/ConversationsSidebar/layout/Sidebar.svelte';
  import CodebaseSidebar from '$lib/features/CodebaseSidebar/layout/Sidebar.svelte';

  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import Header from '$lib/shared/layout/Header.svelte';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import { conversationsStore } from '$lib/shared/stores/conversations';
  import { onMount } from 'svelte';

  let sidebarOpen = browser ? window.innerWidth > 768 : true;

  onMount(() => {
    conversationsStore.fetchFromServer();
  });
</script>

<div class="main-template">
  <Header style="max-width: 100vw" bind:sidebarOpen />

  <div class="relative isolate flex overflow-hidden">
    <ConversationsSidebar open={sidebarOpen} />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>

    <CodebaseSidebar selectedRepo={$settingsStore.selectedRepo} />
  </div>
</div>

<SettingsModal />

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-rows: min-content 1fr min-content;
  }
</style>
