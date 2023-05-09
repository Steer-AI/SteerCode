<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  import { locale, locales } from 'svelte-i18n';
  import Listbox from '../components/Listbox/Listbox.svelte';
  import {
    availableRepositories,
    settingsStore
  } from '$lib/features/SettingsModal/stores/settings';
  import Button from '../components/Button.svelte';
  import { _ } from 'svelte-i18n';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import TagIcon from '../components/Icons/TagIcon.svelte';

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

    <a href="/" class="headline-small mx-auto flex items-center uppercase">
      <!-- LOGO -->
      <LogoIcon class="mr-1 h-6 w-6" />
      Cognitic
    </a>

    <div class="flex flex-1 items-center justify-end">
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
    </div>
  </span>

  <Divider />

  <div
    class="flex h-14 flex-shrink-0 flex-col items-center justify-center px-6 md:flex-row md:justify-between"
  >
    <div class="flex">
      <Listbox
        selected={$settingsStore.selectedRepo}
        on:change={(e) => {
          settingsStore.updateSettings({
            ...$settingsStore,
            selectedRepo: e.detail
          });
        }}
        options={availableRepositories}
      >
        <span
          slot="selected-option-prefix"
          class="text-content-primary headline-large flex items-center capitalize"
          let:selected
        >
          <span class="mr-3">
            <GitHubIcon class="h-6 w-6" fill="#8E929A" />
          </span>
          {selected.label}
        </span>
      </Listbox>

      <div
        class="bg-background-secondaryActive label-mini-plus ml-2 flex h-5 items-center px-3"
        style="font-size: 11px;"
      >
        <TagIcon class="text-content-tertiary mr-1 h-3 w-3" />
        <span class="text-content-secondary"
          >{$settingsStore.selectedRepo.version}</span
        >
      </div>
    </div>

    <Button
      variant="secondary"
      size="medium"
      as="a"
      href="https://docs.google.com/forms/d/e/1FAIpQLSei53M_VZH1LVIBygG1k_6Ifwfo_regUEiZkNfKKYKiVbnfrA/viewform"
      target="_blank"
      class="hidden md:flex"
    >
      {$_('header.importRepoButton')}
    </Button>
  </div>
  <Divider />
</header>
