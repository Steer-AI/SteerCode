<script lang="ts">
  import LoginScreen from '$lib/features/Auth/layout/LoginScreen.svelte';
  import { _ } from 'svelte-i18n';
  import LogoIcon from '$lib/shared/components/Icons/LogoIcon.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import LogoText from '$lib/shared/components/Icons/LogoText.svelte';
</script>

<div class="main-template">
  <header class="sticky top-0 z-20">
    <span class="bg-background-primary flex h-14 items-center px-6">
      <a href="/" class="flex items-center">
        <LogoIcon class="mr-2 h-6 w-6" />
        <LogoText class="h-4" />
      </a>
      <div
        class="bg-background-secondaryActive text-content-primarySub label-small-plus ml-2.5 flex h-5 items-center px-2.5"
        style="font-size: 11px;"
      >
        BETA
      </div>
      <div role="separator" class="ml-4 flex-1" />
    </span>
    <Divider />
  </header>

  <main class="flex-1 overflow-hidden">
    <LoginScreen />
  </main>
</div>

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-rows: min-content 1fr;
  }
</style>
