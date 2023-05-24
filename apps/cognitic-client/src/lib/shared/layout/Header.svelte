<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  // import { locale, locales } from 'svelte-i18n';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import Button from '../components/Button.svelte';
  import { _ } from 'svelte-i18n';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import AuthButton from '$lib/features/Auth/components/AuthButton.svelte';
  import LogoText from '../components/Icons/LogoText.svelte';

  export let sidebarOpen: boolean;

  async function handleImportRepo() {
    const res = await fetch('http://127.0.0.1:3000/select-directory', {
      method: 'GET'
    }).then((res) => res.json());
    console.log({ res });
  }
</script>

<svelte:window on:resize={() => (sidebarOpen = window.innerWidth > 768)} />

<header class="sticky top-0 z-20" style={$$props.style}>
  <span class="bg-background-primary flex h-14 items-center px-6">
    <a href="/" class="flex items-center">
      <LogoIcon class="mr-2 h-5 w-5" />
      <LogoText class="h-3.5" />
    </a>
    <div
      class="bg-background-secondaryActive text-content-primarySub label-small-plus mx-2.5 flex h-5 items-center px-2.5"
      style="font-size: 11px;"
    >
      BETA
    </div>

    <div class="headline-latge">
      {#if $settingsStore.selectedRepo !== null}
        {@const paths = $settingsStore.selectedRepo.url.split('/')}
        <span class="text-content-primary"
          >{paths[paths.length - 2] + ' / '}</span
        >
        <span class="text-content-primary">{paths[paths.length - 1]}</span>
      {:else}
        <Button
          variant="secondary"
          size="medium"
          class=""
          on:click={handleImportRepo}
        >
          <GitHubIcon class="mr-2 h-4 w-4" />
          {$_('header.importRepoButton')}
        </Button>
      {/if}
    </div>

    <div role="separator" class="ml-4 flex-1" />
    <AuthButton />
    <!-- <div class="flex flex-1 items-center justify-end">
      <Listbox
        selected={{ label: $locale || 'unknown', value: $locale }}
        on:change={(e) => {
          locale.set(e.detail.value);
          localStorage.setItem('cognitic.locale', e.detail.value);
        }}
        options={$locales.map((l) => {
          return {
            label: l,
            value: l
          };
        })}
      />
    </div> -->
    <button
      class="mr-3 block md:hidden"
      on:click={() => (sidebarOpen = !sidebarOpen)}
    >
      <ActivityFeedIcon class="h-8 w-8" />
    </button>
  </span>

  <Divider />
</header>
