<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  // import { locale, locales } from 'svelte-i18n';
  import Listbox from '../components/Listbox/Listbox.svelte';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import Button from '../components/Button.svelte';
  import { _ } from 'svelte-i18n';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import AuthButton from '$lib/features/Auth/components/AuthButton.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import LogoText from '../components/Icons/LogoText.svelte';

  export let sidebarOpen: boolean;

  const options = settingsStore.availableRepositories;
</script>

<svelte:window on:resize={() => (sidebarOpen = window.innerWidth > 768)} />

<header class="sticky top-0 z-20" style={$$props.style}>
  <span class="bg-background-primary flex h-14 items-center px-6">
    <a href="/" class="flex items-center">
      <LogoIcon class="mr-2 h-5 w-5" />
      <LogoText class="h-3.5" />
    </a>
    <div
      class="bg-background-secondaryActive text-content-primarySub label-small-plus ml-2.5 flex h-5 items-center px-2.5"
      style="font-size: 11px;"
    >
      BETA
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
  </span>

  <Divider />

  <div class="flex h-14 flex-shrink-0 items-center px-6 md:justify-between">
    <button
      class="mr-3 block md:hidden"
      on:click={() => (sidebarOpen = !sidebarOpen)}
    >
      <ActivityFeedIcon class="h-8 w-8" />
    </button>

    <div class="flex items-center">
      <Listbox
        selected={$settingsStore.selectedRepo}
        on:change={(e) => {
          settingsStore.updateSettings({
            selectedRepo: e.detail
          });
        }}
        options={$options}
      >
        <span
          slot="selected-option"
          class="text-content-primary headline-large flex items-center capitalize"
          let:selected
        >
          <span class="mr-3">
            <GitHubIcon class="text-content-tertiary h-6 w-6" />
          </span>
          {selected.label}
        </span>
      </Listbox>

      {#if $settingsStore.selectedRepo.version}
        <div
          class="label-mini-plus flex h-5 items-center"
          style="font-size: 11px;"
        >
          <span class="text-content-primarySub">
            {$settingsStore.selectedRepo.version}
          </span>
        </div>
      {/if}
    </div>

    <Button
      variant="secondary"
      size="medium"
      as="a"
      href="https://docs.google.com/forms/d/e/1FAIpQLSei53M_VZH1LVIBygG1k_6Ifwfo_regUEiZkNfKKYKiVbnfrA/viewform"
      target="_blank"
      class="hidden md:flex"
      on:click={() => {
        trackEvent('Open Import Repo Form');
      }}
    >
      {$_('header.importRepoButton')}
    </Button>
  </div>
  <Divider />
</header>
