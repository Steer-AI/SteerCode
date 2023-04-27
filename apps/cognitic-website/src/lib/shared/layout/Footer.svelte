<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import DiscordIcon from '../components/Icons/DiscordIcon.svelte';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import TwitterIcon from '../components/Icons/TwitterIcon.svelte';
</script>

<footer style={$$props.style}>
  <Divider />

  <span
    class="bg-background-primary text-content-secondary grid h-14 w-full items-center gap-3 px-6"
  >
    <a
      target="_blank"
      rel="noopener"
      href="https://twitter.com/singular_xyz"
      class="hover:text-content-primary"
    >
      <TwitterIcon class="h-6 w-6" />
    </a>

    <a
      target="_blank"
      rel="noopener"
      href="https://discord.gg/euRB6WkX"
      class="hover:text-content-primary"
    >
      <DiscordIcon class="h-6 w-6" />
    </a>

    <a
      target="_blank"
      rel="noopener"
      href="https://github.com/cognitic-ai/cognitic"
      class="hover:text-content-primary"
    >
      <GitHubIcon fill="currentColor" class="h-5 w-5" />
    </a>

    <div role="separator" />

    <div class="body-regular whitespace-nowrap">@Cognitic 2023</div>
  </span>
</footer>

<style>
  footer > span.grid {
    grid-template-columns: min-content min-content min-content 1fr min-content;
  }
</style>
