<script>
  import { afterNavigate, goto } from '$app/navigation';
  import Button from '$lib/shared/components/Button.svelte';

  let previousPage = '/';
  afterNavigate(({ from }) => {
    console.log('afterNavigate', from);
    previousPage = from?.url.pathname || previousPage;
  });

  function handleGoBack() {
    goto(previousPage, { replaceState: true });
  }
</script>

<main
  class="bg-background-primary flex min-h-screen w-full flex-col items-center justify-center"
>
  <h1 class="text-content-primary headline-large mb-8">Congratulation</h1>

  <p class="text-content-secondary body-regular mb-6 text-center">
    You have successfully subscribed to SteerCode premium
    <br />
    Enjoy the app without any limitations
  </p>

  <Button variant="primary" size="medium" on:click={handleGoBack}>
    Go back to the app
  </Button>
</main>
