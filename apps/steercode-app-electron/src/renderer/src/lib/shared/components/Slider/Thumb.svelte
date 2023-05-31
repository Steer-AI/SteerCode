<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import handle from './handle';

  const dispatch = createEventDispatcher();
  export let pos: number;
  let active: boolean;
</script>

<div
  class="thumb"
  style={`left: ${pos * 100}%;`}
  use:handle
  on:dragstart={() => ((active = true), dispatch('active', true))}
  on:drag={({ detail: v }) => (pos = v)}
  on:dragend={() => ((active = false), dispatch('active', false))}
>
  <div class="thumb-content" class:active>
    <slot />
  </div>
</div>

<style lang="postcss">
  .thumb {
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
  }

  .thumb-content {
    position: relative;
    width: fit-content;
    height: fit-content;
    transform: translate(-50%, -50%);
  }

  .thumb-content::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-25%, -25%) scale(0);
    transition: transform 100ms ease-in-out;
    @apply bg-content-primary;
  }

  .thumb-content.active::before {
    transform: scale(1);
  }
</style>
