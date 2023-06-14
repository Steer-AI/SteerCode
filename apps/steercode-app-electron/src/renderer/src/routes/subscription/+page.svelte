<script>
  import { afterNavigate, goto } from '$app/navigation';
  import Button from '$lib/shared/components/Button.svelte';
  import { user } from '$lib/shared/stores/user';
  import { _ } from 'svelte-i18n';

  let previousPage = '/';
  afterNavigate(({ from, to }) => {
    console.log('afterNavigate', { from, to });
    if (to?.url.pathname === from?.url.pathname) {
      previousPage = '/';
    } else {
      previousPage = from?.url.pathname || previousPage;
    }
  });

  function handleGoBack() {
    user.refetchSubscription();
    goto(previousPage, { replaceState: true });
  }
</script>

<main
  class="bg-background-primary flex min-h-screen w-full flex-col items-center justify-center"
>
  <h1 class="text-content-primary headline-large mb-8">
    {$_('afterSubPage.title')}
  </h1>

  <p class="text-content-secondary body-regular mb-6 text-center">
    {@html $_('afterSubPage.description')}
  </p>

  <Button variant="primary" size="medium" on:click={handleGoBack}>
    {$_('afterSubPage.leaveButton')}
  </Button>
</main>
