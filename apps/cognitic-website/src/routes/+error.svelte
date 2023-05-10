<script lang="ts">
  import { page } from '$app/stores';
  import Error from '$lib/shared/layout/Error.svelte';

  $: summary = $page.error?.message.replace(/:(.*?)$/, '') || '';
</script>

<div class="min-h-screen">
  <Error status={$page.status} {summary} />
</div>
