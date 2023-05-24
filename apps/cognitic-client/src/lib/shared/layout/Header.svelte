<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  // import { locale, locales } from 'svelte-i18n';
  import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
  import Button from '../components/Button.svelte';
  import { _ } from 'svelte-i18n';
  import GitHubIcon from '../components/Icons/GitHubIcon.svelte';
  import LogoText from '../components/Icons/LogoText.svelte';
  import { Log } from '$lib/core/services/logging';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  } from '@rgossiaux/svelte-headlessui';
  import ExpandIcon from '../components/Icons/ExpandIcon.svelte';
  import { page } from '$app/stores';

  export let sidebarOpen: boolean;

  async function handleImportRepo() {
    const res = await fetch('http://127.0.0.1:3000/select-directory', {
      method: 'GET'
    }).then(
      (res) => res.json() as { success: boolean; data: string; message: string }
    );

    if (res.success) {
      if (res.data.endsWith('/')) res.data = res.data.slice(0, -1);

      settingsStore.updateSettings({
        selectedRepo: {
          url: res.data,
          name: res.data.split('/').pop() || res.data
        }
      });
    } else {
      Log.ERROR(res.message);
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: res.message,
        position: Position.BottomRight
      });
    }
  }
</script>

<svelte:window on:resize={() => (sidebarOpen = window.innerWidth > 768)} />

<header class="sticky top-0 z-20" style={$$props.style}>
  <span class="bg-background-primary flex h-16 items-center px-6">
    <a href="/" class="flex items-center">
      <LogoIcon class="mr-2 h-6 w-6" />
      <LogoText class="h-4" />
    </a>
    <div
      class="bg-background-secondaryActive text-content-primarySub label-small-plus mx-2.5 flex h-5 items-center px-2.5"
      style="font-size: 11px;"
    >
      BETA
    </div>

    <div class="flex items-center">
      {#if $settingsStore.selectedRepo !== null}
        {@const paths = $settingsStore.selectedRepo.url.split('/')}
        <Menu
          let:open
          class="relative {$page.url.pathname === '/' ? '' : 'hidden'}"
        >
          <MenuButton class="mr-2 flex items-center">
            <ExpandIcon class="h-5 w-5" expanded={!open} />
          </MenuButton>
          <MenuItems
            class="bg-background-secondary border-stroke-primary absolute top-full mt-4 border"
          >
            <MenuItem
              as="button"
              on:click={handleImportRepo}
              class="body-regular text-content-secondary hover:text-content-primary flex h-10 items-center whitespace-nowrap px-3"
            >
              <GitHubIcon class="mr-2 h-4 w-4" />
              {$_('header.importRepoButton')}
            </MenuItem>
          </MenuItems>
        </Menu>

        <span class="text-content-secondary headline-large">
          {paths[paths.length - 2] + ' / '}
        </span>
        <span class="text-content-primary headline-large ml-2">
          {paths[paths.length - 1]}
        </span>
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
