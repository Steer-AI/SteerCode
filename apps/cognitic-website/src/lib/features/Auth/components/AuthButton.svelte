<script lang="ts">
  import Button from '$lib/shared/components/Button.svelte';
  import { user } from '$lib/shared/stores/user';
  import {
    Popover,
    PopoverButton,
    PopoverPanel
  } from '@rgossiaux/svelte-headlessui';
  import JazzIcon from './JazzIcon.svelte';
  import ExpandIcon from '$lib/shared/components/Icons/ExpandIcon.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import { _ } from 'svelte-i18n';
  import { signOut } from '../utils/authHelpers';
</script>

{#if $user}
  <Popover let:open class="relative">
    <PopoverButton>
      <Button variant="tertiary" size="medium" as="div">
        <span class="h-4 w-4">
          {#if $user.photoURL}
            <img src={$user.photoURL} alt="User avatar" class="h-full w-full" />
          {:else}
            <JazzIcon identifier={$user.uid} size={16} />
          {/if}
        </span>
        <span
          class="mono-regular ml-2 mr-auto mt-px normal-case {open
            ? 'text-content-primary'
            : 'text-content-primarySub'}"
        >
          {$user.displayName || $user.email}
        </span>

        <ExpandIcon
          expanded={!open}
          style="min-width: 20px; min-height: 20px;"
          class="ml-1 h-5 w-5 transition-transform {open
            ? 'text-content-primary'
            : 'text-content-tertiary'}"
        />
      </Button>
    </PopoverButton>
    {#if open}
      <div
        class="body-small border-stroke-secondary bg-background-secondary absolute right-0 z-50 mt-2 w-full whitespace-nowrap border"
      >
        <PopoverPanel static class="body-regular flex flex-col">
          <!-- Log out -->
          <PopoverButton
            class="separator text-error hover:bg-background-secondaryHover flex h-14 items-center px-6 after:mx-0"
            on:click={() => {
              signOut();
              trackEvent('logout');
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-4 w-4"
            >
              <path
                d="M10.0002 1.33331L7.80485 3.52863L7.13818 2.86196L6.19548 3.80467L7.39079 4.99998L6.19548 6.19529L7.13818 7.138L8.3335 5.94269L10.0575 7.66665L8.86214 8.86196L9.80485 9.80467L11.0002 8.60935L12.1955 9.80467L13.1382 8.86196L12.4715 8.19529L14.6668 5.99998L12.8049 4.138L14.4715 2.47133L13.5288 1.52863L11.8621 3.19529L10.0002 1.33331ZM3.80485 6.19529L2.86214 7.138L3.52881 7.80467L1.3335 9.99998L3.19548 11.862L1.52881 13.5286L2.47152 14.4713L4.13818 12.8047L6.00016 14.6666L8.19548 12.4713L8.86214 13.138L9.80485 12.1953L3.80485 6.19529Z"
                fill="currentColor"
              />
            </svg>
            {$_('header.logOut')}
          </PopoverButton>
        </PopoverPanel>
      </div>
    {/if}
  </Popover>
{:else}
  <Button
    as="a"
    href="/login"
    variant="secondary"
    size="medium"
    on:click={async () => {
      trackEvent('login');
    }}
  >
    {$_('header.logIn')}
  </Button>
{/if}
