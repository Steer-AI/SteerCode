<script lang="ts">
  import Cookies from 'js-cookie';
  import { slide } from 'svelte/transition';
  import { onMount, createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Button from '../components/Button.svelte';
  import { writable } from 'svelte/store';
  import Dialog from '$lib/shared/layout/Dialog.svelte';
  import Divider from '../components/Divider.svelte';
  import Checkbox from '../components/Checkbox.svelte';
  import Switch from '../components/Switch.svelte';

  const dispatch = createEventDispatcher();

  let shown = false;
  let dialogEl: HTMLDialogElement;

  const cookieName = 'cognitic.gdpr';

  const defaultCookieOptions = {
    sameSite: 'strict',
    path: '/'
  } as const;

  const cookieChoices = {
    necessary: {
      label: $_('gdpr.choices.necessary.label'),
      description: $_('gdpr.choices.necessary.description'),
      value: true
    },
    analytics: {
      label: $_('gdpr.choices.analytics.label'),
      description: $_('gdpr.choices.analytics.description'),
      value: true
    }
  };

  type CookieChoices = Partial<typeof cookieChoices>;
  type CookieChoicesKeys = keyof CookieChoices;
  type SelectedChoise = { [K in CookieChoicesKeys]: boolean };

  const selectedCoises = Object.keys(cookieChoices).reduce((acc, key) => {
    acc[key as CookieChoicesKeys] =
      cookieChoices[key as CookieChoicesKeys].value;
    return acc;
  }, {} as SelectedChoise);

  export function show() {
    shown = true;
  }

  onMount(() => {
    if (!cookieName) {
      throw new Error('You must set gdpr cookie name');
    }

    const cookie = Cookies.get(cookieName);
    if (!cookie) {
      // show();
      return;
    }

    try {
      const { choices } = JSON.parse(cookie);
      console.log({ choices });
      const valid = validate(selectedCoises, choices);

      if (!valid) {
        throw new Error('cookie consent has changed');
      }

      execute(choices);
    } catch (e) {
      removeCookie();
      show();
    }
  });

  function validate(choice: SelectedChoise, cookieChoices: SelectedChoise) {
    const choices = Object.keys(choice) as CookieChoicesKeys[];
    const chosen = Object.keys(cookieChoices) as CookieChoicesKeys[];

    if (chosen.length !== choices.length) {
      return false;
    }

    return chosen.every((c) => choices.includes(c));
  }

  function setCookie(choices: SelectedChoise) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);

    const options = Object.assign({}, defaultCookieOptions, { expires });
    Cookies.set(cookieName, JSON.stringify({ choices }), options);
  }

  function removeCookie() {
    Cookies.remove(cookieName, defaultCookieOptions);
  }

  function execute(chosen: SelectedChoise) {
    const types = Object.keys(selectedCoises) as CookieChoicesKeys[];

    types.forEach((t) => {
      const agreed = chosen[t];
      if (cookieChoices[t] && agreed) {
        cookieChoices[t].value = agreed;
      }
      if (agreed) {
        dispatch(`${t}`);
      }
    });
    shown = false;
  }

  function reject() {
    const necessaryCookieChoices = Object.keys(selectedCoises).reduce(
      (acc, key) => {
        if (key === 'necessary') {
          acc[key as CookieChoicesKeys] = true;
        } else {
          acc[key as CookieChoicesKeys] = false;
        }
        return acc;
      },
      {} as SelectedChoise
    );
    setCookie(necessaryCookieChoices);
    execute(necessaryCookieChoices);
  }

  function choose() {
    setCookie(selectedCoises);
    execute(selectedCoises);
  }
</script>

{#if shown}
  <div
    class="fixed bottom-0 z-50 flex w-full flex-col"
    transition:slide={{ duration: 250, delay: 500 }}
  >
    <Divider class="w-full" />
    <div class="bg-background-primaryActive flex items-center gap-6 px-6 py-3">
      <div class="flex flex-col gap-3">
        <p class="headline-small text-content-primary">
          {$_('gdpr.heading')}
        </p>
        <p class="body-small text-content-secondary">
          {@html $_('gdpr.description')}
        </p>
      </div>

      <div class="ml-auto flex flex-col items-center gap-3 md:flex-row">
        <Button
          type="submit"
          size="medium"
          variant="tertiary"
          class="flex-1 whitespace-nowrap"
          on:click={() => dialogEl && dialogEl.showModal()}
          aria-label={$_('gdpr.settingsLabel')}
        >
          {$_('gdpr.settingsLabel')}
        </Button>

        <Button
          type="submit"
          size="medium"
          variant="secondary"
          class="flex-1 whitespace-nowrap"
          on:click={reject}
          aria-label={$_('gdpr.rejectLabel')}
        >
          {$_('gdpr.rejectLabel')}
        </Button>

        <Button
          type="submit"
          size="medium"
          variant="primary"
          class="flex-1 whitespace-nowrap"
          on:click={choose}
          aria-label={$_('gdpr.acceptLabel')}
        >
          {$_('gdpr.acceptLabel')}
        </Button>
      </div>
    </div>
  </div>
{/if}

<Dialog bind:dialogEl class="w-full max-w-sm">
  <h3 slot="title" class="headline-small text-content-primary">
    {$_('gdpr.heading')}
  </h3>

  <div
    slot="description"
    class="text-content-secondary body-regular flex flex-col gap-3 py-4"
  >
    <p class="body-small text-content-secondary">
      {@html $_('gdpr.description')}
    </p>

    {#each Object.entries(cookieChoices) as [choiceId, choice] (choiceId)}
      <div class="mt-4 flex flex-col gap-2">
        <div class="flex gap-3">
          <h6 class="label-regular text-content-primarySub flex-1">
            {choice.label}
          </h6>
          <Switch
            size="large"
            disabled={choiceId === 'necessary'}
            bind:active={selectedCoises[choiceId]}
          />
        </div>
        <p class="text-content-secondary body-small">
          {choice.description}
        </p>
      </div>
    {/each}
  </div>

  <div slot="action">
    <Divider class="my-4" />
    <Button
      variant="primary"
      size="medium"
      type="submit"
      class="ml-auto"
      on:click={() => dialogEl.close()}
    >
      {$_('gdpr.closeLabel')}
    </Button>
  </div>
</Dialog>
