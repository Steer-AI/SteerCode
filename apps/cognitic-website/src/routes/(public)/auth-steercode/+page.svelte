<script lang="ts">
  import LogoIcon from '$lib/shared/components/Icons/LogoIcon.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import LogoText from '$lib/shared/components/Icons/LogoText.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import GoogleIcon from '$lib/shared/components/Icons/GoogleIcon.svelte';
  import GitHubIcon from '$lib/shared/components/Icons/GitHubIcon.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import type { UserCredential, OAuthCredential } from 'firebase/auth';

  import { _ } from 'svelte-i18n';
  import {
    loginGitHub,
    loginGoogle,
    loginTwitter
  } from '$lib/features/Auth/utils/authHelpers';
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

    window.location.href = `steercode://auth?credential=${encodeURIComponent(
      JSON.stringify(credential)
    )}&providerId=${providerId}`;
    return true;
  }

  let loadingGithub = false;
  let loadingGoogle = false;
  let loadingTwitter = false;
</script>

<div class="main-template">
  <header class="sticky top-0 z-20">
    <span class="bg-background-primary flex h-14 items-center px-6">
      <LogoIcon class="mr-2 h-6 w-6" />
      <LogoText class="h-4" />
      <div
        class="bg-background-secondaryActive text-content-primarySub label-small-plus ml-2.5 flex h-5 items-center px-2.5"
        style="font-size: 11px;"
      >
        BETA
      </div>
      <div role="separator" class="ml-4 flex-1" />
    </span>
    <Divider />
  </header>

  <main class="flex-1 overflow-hidden">
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
            trackEvent('Login - electron', { provider: 'google' });
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
            trackEvent('Login - electron', { provider: 'github' });
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
                trackEvent('Login - electron', { provider: 'twitter' });
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
  </main>
</div>

<style lang="postcss">
  .main-template {
    @apply grid max-h-screen min-h-screen overflow-hidden;
    grid-template-rows: min-content 1fr;
  }
</style>
