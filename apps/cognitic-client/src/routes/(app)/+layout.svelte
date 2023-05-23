<script lang="ts">
  import { browser } from '$app/environment';
  import ConversationsSidebar from '$lib/features/ConversationsSidebar/layout/Sidebar.svelte';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import Header from '$lib/shared/layout/Header.svelte';

  let sidebarOpen = browser ? window.innerWidth > 768 : true;
</script>

<div class="main-template">
  <Header style="max-width: 100vw" bind:sidebarOpen />

  <div class="relative isolate flex overflow-hidden">
    <ConversationsSidebar open={sidebarOpen} />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>
  </div>
</div>

<SettingsModal />

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-rows: min-content 1fr;
  }
</style>
