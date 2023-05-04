<script lang="ts">
  import Divider from '../components/Divider.svelte';
  import ActivityFeedIcon from '../components/Icons/ActivityFeedIcon.svelte';
  import LogoIcon from '../components/Icons/LogoIcon.svelte';
  import { locale, locales } from 'svelte-i18n';
  import Listbox from '../components/Listbox/Listbox.svelte';

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
</header>
