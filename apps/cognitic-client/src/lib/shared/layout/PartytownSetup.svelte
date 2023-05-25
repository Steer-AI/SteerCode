<script lang="ts">
  import { partytownSnippet } from '@builder.io/partytown/integration';
  import { onMount } from 'svelte';
  import { init } from '@sentry/svelte';
  import { PUBLIC_SENTRY_DNS, PUBLIC_SENTRY_ENABLED } from '$env/static/public';
  import { BrowserTracing } from '@sentry/browser';
  import { dev } from '$app/environment';

  // Add the Partytown script to the DOM head
  let scriptEl: HTMLScriptElement;
  onMount(async () => {
    scriptEl && (scriptEl.textContent = partytownSnippet());
    // Initialize the Sentry SDK here
    init({
      enabled: PUBLIC_SENTRY_ENABLED === 'true',
      environment: dev ? 'development' : 'production',
      dsn: PUBLIC_SENTRY_DNS,
      integrations: [new BrowserTracing()],
      ignoreErrors: [
        // Random plugins/extensions
        'top.GLOBALS',
        // Facebook borked
        'fb_xd_fragment',
        // sw failed
        'partytown-sandbox-sw'
      ],
      denyUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.1,
      debug: false
    });
  });
</script>

<svelte:head>
  <script>
    partytown = {
      forward: [],
      debug: false
    };
  </script>

  <script bind:this={scriptEl}></script>
</svelte:head>
