<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';

  export let sidebarOpen = true;
</script>

<header class="sticky top-0" style={$$props.style}>
  <span class="bg-background-primary flex h-14 items-center px-6">
    <div class="flex-1">
      <button
        class="mr-3 block md:hidden"
        on:click={() => (sidebarOpen = !sidebarOpen)}
      >
        <ActivityFeedIcon class="h-8 w-8" />
      </button>
    </div>

    <a href="/" class="headline-large mx-auto flex items-center">
      <!-- LOGO -->
      <LogoIcon class="mr-1 h-6 w-6" />
      SuperGPT
    </a>

    <div class="flex-1" />
  </span>

  <Divider />
</header>
