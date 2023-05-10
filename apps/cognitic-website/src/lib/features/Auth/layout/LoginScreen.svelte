<script lang="typescript">
  import { onDestroy, onMount } from 'svelte';
  import { setPersistence, indexedDBLocalPersistence } from 'firebase/auth';
  import Button from '$lib/shared/components/Button.svelte';
  import { loginGitHub, loginGoogle, loginTwitter } from '../utils/authHelpers';
  import { auth } from '$lib/core/services/firebase';
  import type { Unsubscriber } from 'svelte/store';
  import { user } from '$lib/shared/stores/user';
  import { goto } from '$app/navigation';
  import GoogleIcon from '$lib/shared/components/Icons/GoogleIcon.svelte';
  import GitHubIcon from '$lib/shared/components/Icons/GitHubIcon.svelte';
  import TwitterIcon from '$lib/shared/components/Icons/TwitterIcon.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import { _ } from 'svelte-i18n';
  import Divider from '$lib/shared/components/Divider.svelte';

  let unsub: Unsubscriber | null = null;

  onMount(async () => {
    await setPersistence(auth, indexedDBLocalPersistence);
    unsub = user.subscribe((u) => {
      if (u !== null) goto('/');
    });
  });

  onDestroy(() => {
    if (unsub) {
      unsub();
    }
  });

  let loadingGithub = false;
  let loadingGoogle = false;
  let loadingTwitter = false;
</script>

<div class="flex h-full flex-col items-center justify-center gap-6">
  <h1 class="headline-large">{$_('auth.title')}</h1>
  <p class="body-regular-plus text-content-secondary">
    {$_('auth.description')}
  </p>

  <Divider class="w-72" />

  <Button
    class="w-64"
    variant="tertiary"
    size="large"
    on:click={async () => {
      loadingGoogle = true;
      await loginGoogle();
      loadingGoogle = false;
    }}
  >
    {#if loadingGoogle}
      <Spinner class="h-5 w-5" />
    {:else}
      <GoogleIcon class="mr-3 h-5 w-5" />
      <span class="text-content-primary">
        {$_('auth.googleButton')}
      </span>
    {/if}
  </Button>

  <Button
    class="w-64"
    variant="tertiary"
    size="large"
    on:click={async () => {
      loadingGithub = true;
      await loginGitHub();
      loadingGithub = false;
    }}
  >
    {#if loadingGithub}
      <Spinner class="h-5 w-5" />
    {:else}
      <GitHubIcon class="mr-3 h-5 w-5" />
      <span class="text-content-primary">
        {$_('auth.githubButton')}
      </span>
    {/if}
  </Button>

  <Button
    class="w-64"
    variant="tertiary"
    size="large"
    on:click={async () => {
      loadingTwitter = true;
      await loginTwitter();
      loadingTwitter = false;
    }}
  >
    {#if loadingTwitter}
      <Spinner class="h-5 w-5" />
    {:else}
      <TwitterIcon class="mr-3 h-5 w-5 text-[#54ACEE]" />
      <span class="text-content-primary">
        {$_('auth.twitterButton')}
      </span>
    {/if}
  </Button>

  <div role="separator" class="h-14 w-full" />
</div>
