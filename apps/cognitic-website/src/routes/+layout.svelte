<script lang="ts">
  import PartytownSetup from '../lib/shared/layouts/PartytownSetup.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<PartytownSetup />

<slot />
