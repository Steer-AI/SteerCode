<script lang="ts">
  import { roundValue } from '$lib/shared/utils/formatters';
  import Thumb from './Thumb.svelte';

  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value: number = min;
  export let numDecimals = 0;
  let pos: number;
  let active = false;

  $: if (active) setValue(pos);
  $: if (!active) setPos(value);
  $: min, max, clamp();
  $: progress = `
    left: ${0}%;
    right: ${100 - pos * 100}%;
  `;

  function setValue(pos: number) {
    const offset = min % step;
    const width = max - min;
    value = roundValue(
      Math.round((min + pos * width - offset) / step) * step + offset,
      numDecimals
    );
  }

  function setPos(value: number) {
    pos = (Math.min(Math.max(value, min), max) - min) / (max - min);
  }

  function clamp() {
    setPos(value);
    setValue(pos);
  }
</script>

<div class="track">
  <div class="progress" style={progress} />
  <Thumb bind:pos on:active={({ detail: v }) => (active = v)}>
    <slot name="left">
      <slot>
        <div class="thumb" />
      </slot>
    </slot>
  </Thumb>
</div>

<style lang="postcss">
  .track {
    width: calc(100% - 16px);
    @apply bg-stroke-primary relative mx-4 my-2 h-px;
  }

  .progress {
    @apply bg-stroke-secondary absolute inset-0;
  }

  .thumb {
    @apply border-content-primary bg-background-primary h-3 w-3 border;
  }
</style>
