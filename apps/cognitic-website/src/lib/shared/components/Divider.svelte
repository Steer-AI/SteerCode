<script lang="ts">
  export let vertical: boolean = false;
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<div
  role="separator"
  class:bg-stroke-primary={variant === 'primary'}
  class:bg-stroke-secondary={variant === 'secondary'}
  class="{vertical ? 'w-px' : 'h-px'} {$$props.class}"
  style={$$props.style}
/>
