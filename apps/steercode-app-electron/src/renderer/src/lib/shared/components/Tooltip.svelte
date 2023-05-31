<script lang="ts" context="module">
  let counter = 0;
</script>

<script lang="ts">
  import { createPopperActions, type PopperOptions } from 'svelte-popperjs';
  import { createEventDispatcher } from 'svelte';
  import type { VirtualElement } from '@popperjs/core';
  import TooltipIcon from './Icons/TooltipIcon.svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // https://popper.js.org/docs/v2/modifiers/
  // https://popper.js.org/docs/v2/constructors/#options
  export let popperOptions: PopperOptions<object> = {
    placement: 'bottom',
    strategy: 'fixed'
  };

  const [popperRef, popperContent, getInstance] =
    createPopperActions(popperOptions);

  export let delayShow = 300;
  export let delayHide = 100;
  export let followCursor = false;
  export let disabled = false;
  export let showTooltip = false;
  export let tooltipClass = '';
  export let withArrow = false;
  export let showOn: 'hover' | 'click' | 'click-autohide' = 'hover';
  export let offset: [number, number] = [0, 8];

  export let animationDuration: number = 0;

  export let extraOpts: PopperOptions<object> = {
    modifiers: [{ name: 'offset', options: { offset } }]
  };

  let timeoutId: null | ReturnType<typeof setTimeout> = null;

  function onToggle(visible: boolean) {
    dispatch('toggle', visible);
    showTooltip = visible;
  }

  function generateGetBoundingClientRect(x = 0, y = 0) {
    const rect: DOMRect = {
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
      x,
      y,
      toJSON: function () {
        throw new Error('Function not implemented.');
      }
    };
    return () => rect;
  }
  const virtualElement: VirtualElement = {
    getBoundingClientRect: generateGetBoundingClientRect()
  };

  const tooltipTriggerRef = (el: HTMLElement) => {
    followCursor ? popperRef(virtualElement) : popperRef(el);
  };

  const tooltipID = `tooltip-${counter++}`;
</script>

<div
  aria-describedby={tooltipID}
  use:tooltipTriggerRef
  on:mouseenter={(e) => {
    if (showOn !== 'hover') return;
    timeoutId && clearTimeout(timeoutId);
    if (!showTooltip) timeoutId = setTimeout(() => onToggle(true), delayShow);
    dispatch('mouseenter', e);
  }}
  on:click={() => {
    if (showOn === 'hover') return;
    if (showOn === 'click') {
      onToggle(!showTooltip);
    } else if (showOn === 'click-autohide') {
      timeoutId && clearTimeout(timeoutId);
      onToggle(true);
      timeoutId = setTimeout(() => {
        onToggle(false);
      }, delayHide);
    }
  }}
  on:mouseleave={(e) => {
    if (showOn !== 'hover') return;
    timeoutId && clearTimeout(timeoutId);
    if (showTooltip) timeoutId = setTimeout(() => onToggle(false), delayHide);
    dispatch('mouseleave', e);
  }}
  on:mousemove={({ clientX: x, clientY: y }) => {
    if (showOn !== 'hover') return;
    if (followCursor) {
      const instance = getInstance();
      if (!instance) return;
      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
        x,
        y
      );
      instance.update();
    }
  }}
  class={$$props.class}
  style={$$props.style}
  role={$$props.role}
>
  <slot name="trigger">
    <div
      class="fill-content-1000 stroke-content-1000 text-content-primary h-6 w-6"
    >
      <TooltipIcon />
    </div>
  </slot>
</div>

{#if !disabled && showTooltip}
  <div
    id={tooltipID}
    role="tooltip"
    use:popperContent={extraOpts}
    class:pointer-events-none={followCursor}
    class="body-small border-background-600 bg-background-inverse text-content-inverse z-30 border px-2 py-1 {tooltipClass}"
    in:fade={{ duration: animationDuration }}
    out:fade={{ duration: animationDuration / 2 }}
  >
    <slot name="tooltip">
      <div class="text-content-primary">Tooltip component</div>
    </slot>

    {#if withArrow}
      <div id="arrow" data-popper-arrow />
    {/if}
  </div>
{/if}

<style>
  #arrow,
  #arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  #arrow {
    visibility: hidden;
  }

  #arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  :global(#tooltip[data-popper-placement^='top'] > #arrow) {
    bottom: -5px;
  }

  :global(#tooltip[data-popper-placement^='bottom'] > #arrow) {
    top: -5px;
  }

  :global(#tooltip[data-popper-placement^='left'] > #arrow) {
    right: -5px;
  }

  :global(#tooltip[data-popper-placement^='right'] > #arrow) {
    left: -5px;
  }

  :global(
      #tooltip[data-popper-placement^='top'] > #arrow:before,
      #tooltip[data-popper-placement^='top'] > #arrow
    ) {
    border-right: inherit;
    border-bottom: inherit;
  }

  :global(
      #tooltip[data-popper-placement^='bottom'] > #arrow:before,
      #tooltip[data-popper-placement^='bottom'] > #arrow
    ) {
    border-left: inherit;
    border-top: inherit;
  }

  :global(
      #tooltip[data-popper-placement^='left'] > #arrow:before,
      #tooltip[data-popper-placement^='left'] > #arrow
    ) {
    border-right: inherit;
    border-top: inherit;
  }

  :global(
      #tooltip[data-popper-placement^='right'] > #arrow:before,
      #tooltip[data-popper-placement^='right'] > #arrow
    ) {
    border-left: inherit;
    border-bottom: inherit;
  }
</style>
