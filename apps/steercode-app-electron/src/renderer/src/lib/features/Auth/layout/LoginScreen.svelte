<script lang="typescript">
  import { onMount } from 'svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { loginGitHub, loginGoogle, loginTwitter } from '../utils/authHelpers';
  import GoogleIcon from '$lib/shared/components/Icons/GoogleIcon.svelte';
  import GitHubIcon from '$lib/shared/components/Icons/GitHubIcon.svelte';
  import TwitterIcon from '$lib/shared/components/Icons/TwitterIcon.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import { _ } from 'svelte-i18n';
  import Divider from '$lib/shared/components/Divider.svelte';
  import { trackEvent, trackPage } from '$lib/core/services/tracking';
  import type { UserCredential, OAuthCredential } from 'firebase/auth';

  onMount(async () => {
    trackPage('Login Page');
  });

  async function handleLogin(providerId: string) {
    let resp: {
      credential: OAuthCredential | null;
      result: UserCredential;
    } | null = null;

    if (providerId === 'github.com') {
      resp = await loginGitHub();
    }
    if (providerId === 'google.com') {
      resp = await loginGoogle();
    }
    if (providerId === 'twitter.com') {
      resp = await loginTwitter();
    }

    if (!resp || !resp.credential) return false;

    const credential = resp.credential.toJSON();

    console.log('resp', resp);
    console.log('credential', credential);
    console.log('cred s', encodeURIComponent(JSON.stringify(credential)));

    window.addEventListener('beforeunload', (event) => {
      console.log('beforeunload', event);
    });

    window.location.href = `steercode://auth?credential=${encodeURIComponent(
      JSON.stringify(credential)
    )}&providerId=${providerId}`;
    return true;
  }

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
      const succ = await handleLogin('google.com');
      loadingGoogle = false;
      if (succ) {
        trackEvent('Login', { provider: 'google' });
      }
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
      const succ = await handleLogin('github.com');
      loadingGithub = false;
      if (succ) {
        trackEvent('Login', { provider: 'github' });
      }
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

  <!-- <Button
    class="w-64"
    variant="tertiary"
    size="large"
    on:click={async () => {
      loadingTwitter = true;
      const succ = await loginTwitter();
      loadingTwitter = false;
      if (succ) {
        trackEvent('Login', { provider: 'twitter' });
      }
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
  </Button> -->

  <div role="separator" class="h-14 w-full" />
</div>
