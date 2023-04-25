<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';

  export let sidebarOpen = true;
</script>

<header class="sticky top-0" style={$$props.style}>
  <span class="bg-background-primary flex h-14 items-center px-6">
    <button class="mr-3 block" on:click={() => (sidebarOpen = !sidebarOpen)}>
      <ActivityFeedIcon class="h-8 w-8" />
    </button>

    <a href="/" class="headline-large mx-auto">Cognitic</a>
  </span>

  <Divider />
</header>
