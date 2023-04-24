<script lang="ts">
  import { navigating } from '$app/stores';
  import ConversationsSidebar from '$lib/features/ConversationsSidebar/layout/Sidebar.svelte';
  import Footer from '$lib/shared/layouts/Footer.svelte';
  import Header from '$lib/shared/layouts/Header.svelte';

  import { fade } from 'svelte/transition';
</script>

{#if $navigating}
  <div
    role="progressbar"
    class="loader absolute top-0"
    style="width: 60vw; --translateX: 40vw"
    in:fade={{ duration: 100, delay: 400 }}
  />
{/if}

<div class="main-template">
  <Header style="grid-area: header" />

  <ConversationsSidebar style="grid-area: leftSidebar" />

  <main class="overflow-scroll px-6" style="grid-area: main">
    <slot />
  </main>

  <Footer style="grid-area: footer" />
</div>

<style lang="postcss">
  @keyframes progress-load {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(var(--translateX));
    }
    100% {
      transform: translateX(0);
    }
  }

  .loader {
    position: fixed;
    animation-duration: 1500ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-name: progress-load;
    z-index: 2;
    @apply bg-primary h-0.5;
  }

  .main-template {
    @apply grid min-h-screen;
    grid-template-areas:
      'header header header'
      'pageHeader pageHeader pageHeader'
      'leftSidebar main rightSidebar'
      'pageFooter pageFooter pageFooter'
      'footer footer footer';
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content min-content 1fr min-content min-content;
  }
</style>
