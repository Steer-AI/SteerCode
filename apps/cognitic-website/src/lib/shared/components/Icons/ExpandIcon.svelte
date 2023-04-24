<script lang="ts">
  import ArrowDownIcon from './ArrowDownIcon.svelte';
  import ArrowUpIcon from './ArrowUpIcon.svelte';

  export let expanded: boolean = true;
</script>

{#if expanded}
  <ArrowDownIcon {...$$restProps} />
{:else}
  <ArrowUpIcon {...$$restProps} />
{/if}
