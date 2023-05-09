<script lang="ts">
  import ConversationsSidebar from '$lib/features/ConversationsSidebar/layout/Sidebar.svelte';
  import NotificationWrapper from '$lib/features/Notifications/layout/NotificationWrapper.svelte';
  import SettingsModal from '$lib/features/SettingsModal/layout/SettingsModal.svelte';
  import Header from '$lib/shared/layout/Header.svelte';

  let sidebarOpen = true;
</script>

<svelte:window on:resize={() => (sidebarOpen = window.innerWidth > 768)} />

<div class="main-template">
  <Header style="grid-area: header; max-width: 100vw" bind:sidebarOpen />

  <ConversationsSidebar
    class="overflow-hidden {sidebarOpen
      ? 'w-[257px] opacity-100'
      : 'w-0 opacity-0'}"
    style="grid-area: leftSidebar"
  />

  <main
    style="grid-area: main; min-width: min(100vw, 511px)"
    class="overflow-hidden"
  >
    <slot />
  </main>
</div>

<SettingsModal />
<NotificationWrapper />

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-areas:
      'header header header'
      'leftSidebar main main';
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;
  }
</style>
