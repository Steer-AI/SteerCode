<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import DiscordIcon from '../components/Icons/DiscordIcon.svelte';
  import TwitterIcon from '../components/Icons/TwitterIcon.svelte';
</script>

<footer style={$$props.style}>
  <Divider />

  <span
    class="bg-background-secondary text-content-secondary flex h-14 w-full items-center px-6"
  >
    <a
      href="https://twitter.com/singular_xyz"
      class="hover:text-content-primary mr-2"
    >
      <TwitterIcon class="h-6 w-6" />
    </a>

    <a
      href="https://discord.gg/euRB6WkX"
      class="hover:text-content-primary mr-2"
    >
      <DiscordIcon class="h-6 w-6" />
    </a>

    <div class="headline-small ml-auto">@Cognitic 2023</div>
  </span>
</footer>
