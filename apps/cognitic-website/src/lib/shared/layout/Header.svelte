<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  import { locale, locales } from 'svelte-i18n';
  import Listbox from '../components/Listbox/Listbox.svelte';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import Button from '../components/Button.svelte';
  import { _ } from 'svelte-i18n';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import AuthButton from '$lib/features/Auth/components/AuthButton.svelte';
  import { trackEvent } from '$lib/core/services/tracking';

  export let sidebarOpen = true;

  const options = settingsStore.availableRepositories;
</script>

<header class="sticky top-0 z-20" style={$$props.style}>
  <span class="bg-background-primary flex h-14 items-center px-6">
    <a href="/" class="flex items-center">
      <!-- LOGO -->
      <LogoIcon class="mr-2 h-6 w-6" />
      <!-- COGNITIC -->
      <svg
        viewBox="0 0 78 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-auto"
      >
        <path
          d="M47.0593 10.7316H49.0927V0.586021H47.0593V10.7316Z"
          fill="white"
        />
        <path
          d="M35.4088 10.7316H37.3979V3.73116H37.4569L41.671 10.7316H44.0285V0.58602H42.0246V7.62997H41.9657L37.7516 0.58602H35.4088V10.7316Z"
          fill="white"
        />
        <path
          d="M4.84754 10.4065C7.57345 10.4065 9.29741 8.7069 9.29741 5.96759H7.23455C7.08721 7.04012 6.42415 8.60928 4.84754 8.60928C2.94677 8.60928 2.06269 7.26137 2.06269 5.21776C2.06269 3.17415 2.94677 1.81174 4.84754 1.81174C6.37995 1.81174 7.08721 2.63788 7.23455 3.57997H9.29741C9.09112 1.57984 7.45557 2.79576e-05 4.84754 2.79576e-05C1.63539 2.79576e-05 -0.000161926 2.23205 -0.000161926 5.21776C-0.000161926 8.15998 1.63539 10.4065 4.84754 10.4065Z"
          fill="white"
        />
        <path
          d="M16.3735 10.4065C18.8342 10.4065 20.6318 9.01968 20.6318 6.39175C20.6318 6.39175 20.6318 4.64392 20.6318 3.18309C20.6318 1.72225 19.6578 0 16.3735 0V1.81174C16.3735 1.81174 18.6132 1.78704 18.6132 3.50868C18.6132 5.23033 18.5984 6.36276 18.5984 6.36276C18.5984 7.60922 18.068 8.62377 16.3735 8.62377C14.7085 8.62377 14.1633 7.55885 14.1633 6.36276C14.1633 5.16667 14.1633 5.40505 14.1633 3.57997C14.1633 1.75489 16.3735 1.81174 16.3735 1.81174V0C13.0892 0 12.1395 1.99092 12.1422 3.18309C12.145 4.37525 12.1447 3.75389 12.1447 6.39175C12.1447 9.0296 13.957 10.4065 16.3735 10.4065Z"
          fill="white"
        />
        <path
          d="M28.0913 10.7316C30.8172 10.7316 32.6443 8.9634 32.6443 6.22408V5.16604H28.386V6.93427H30.5814C30.4341 8.00681 29.6679 8.9344 28.0913 8.9344C26.1905 8.9344 25.3064 7.58649 25.3064 5.54288C25.3064 3.49927 26.1905 2.13686 28.0913 2.13686C29.6237 2.13686 30.3309 2.963 30.4783 3.90509H32.5411C32.3348 1.90496 30.6993 0.325148 28.0913 0.325148C24.8791 0.325148 23.2436 2.55717 23.2436 5.54288C23.2436 8.4851 24.8791 10.7316 28.0913 10.7316Z"
          fill="white"
        />
        <path
          d="M62.864 10.7316H64.8974V0.586021H62.864V10.7316Z"
          fill="white"
        />
        <path
          d="M55.0192 10.7316H57.0526V2.23835H59.9587V0.58602H57.0526H55.0192H51.9662V2.23835H55.0192V10.7316Z"
          fill="white"
        />
        <path
          d="M16.3735 10.4065C18.8342 10.4065 20.6318 9.01968 20.6318 6.39175C20.6318 6.39175 20.6318 4.64392 20.6318 3.18309C20.6318 1.72225 19.6578 0 16.3735 0V1.81174C16.3735 1.81174 18.6132 1.78704 18.6132 3.50868C18.6132 5.23033 18.5984 6.36276 18.5984 6.36276C18.5984 7.60922 18.068 8.62377 16.3735 8.62377C14.7085 8.62377 14.1633 7.55885 14.1633 6.36276C14.1633 5.16667 14.1633 5.40505 14.1633 3.57997C14.1633 1.75489 16.3735 1.81174 16.3735 1.81174V0C13.0892 0 12.1395 1.99092 12.1422 3.18309C12.145 4.37525 12.1447 3.75389 12.1447 6.39175C12.1447 9.0296 13.957 10.4065 16.3735 10.4065Z"
          fill="white"
        />
        <path
          d="M72.907 10.7316C75.6329 10.7316 77.3569 9.03202 77.3569 6.29271H75.294C75.1467 7.36524 74.4836 8.9344 72.907 8.9344C71.0062 8.9344 70.1222 7.58649 70.1222 5.54288C70.1222 3.49927 71.0062 2.13686 72.907 2.13686C74.4394 2.13686 75.1467 2.963 75.294 3.90509H77.3569C77.1506 1.90496 75.5151 0.325149 72.907 0.325149C69.6949 0.325149 68.0593 2.55717 68.0593 5.54288C68.0593 8.4851 69.6949 10.7316 72.907 10.7316Z"
          fill="white"
        />
      </svg>
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
          slot="selected-option-prefix"
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
