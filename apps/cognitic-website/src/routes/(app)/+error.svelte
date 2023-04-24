<script lang="ts">
  import { page } from '$app/stores';
  import Error from '$lib/shared/layouts/Error.svelte';

  $: summary = $page.error?.message.replace(/:(.*?)$/, '') || '';
</script>

<Error status={$page.status} {summary} />
