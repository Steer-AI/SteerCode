<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { flash } from '$lib/shared/utils/transitions';

  export let value: number | null;
  export let as = 'div';
  export let invertColors = false;
  export let shouldFlash: (
    prev: typeof value,
    current: typeof value
  ) => boolean = () => true;

  let divEl: HTMLDivElement;

  let lastValue: number | null = null;

  afterUpdate(() => {
    if (lastValue === null) {
      lastValue = value;
      return;
    }
    const animate = lastValue !== value && shouldFlash(lastValue, value);
    if (animate && divEl && value !== null) {
      const colorGreen = invertColors ? lastValue > value : lastValue < value;

      flash(divEl, {
        backgroundColor: colorGreen
          ? 'rgba(70,185,95,0.25)'
          : 'rgba(255,0,0,0.25)',
        duration: 750
      });
    }
    lastValue = value;
  });
</script>

<svelte:element this={as} class={`relative ${$$props.class}`}>
  <div bind:this={divEl} class="absolute inset-0" />
  <slot />
</svelte:element>
