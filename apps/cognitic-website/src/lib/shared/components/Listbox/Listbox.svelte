<script lang="ts">
  import { clickOutside } from '$lib/shared/utils/hooks';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import type { Option } from './types';
  import ExpandIcon from '../Icons/ExpandIcon.svelte';

  type T = $$Generic<Option>;

  export let selected: T;
  export let options: T[];
  export let disabled: boolean = false;
  export let listboxClass = '';
  export let buttonClass = 'h-6';
  export let inverted: boolean = false;
  export let variant: 'primary' | 'secondary' = 'secondary';

  const dispatch = createEventDispatcher();

  const onChange = (event: CustomEvent<T>) => {
    dispatch('change', event.detail);
    selected = event.detail;
  };

  let open: boolean = false;
</script>

<div
  class="relative flex items-center {$$props?.class || ''}"
  use:clickOutside={() => {
    open = false;
  }}
>
  <slot name="label" />

  <Listbox
    {disabled}
    bind:value={selected}
    on:change={onChange}
    on:click={() => (open = !open)}
    style="min-width: 58px;"
    class="relative {listboxClass} {disabled ? 'opacity-50' : ''} {open
      ? 'z-20'
      : ''}"
  >
    <ListboxButton
      class="label-small hover:bg-background-secondary {variant === 'primary'
        ? 'border-stroke-secondary border '
        : ''} flex w-full items-center justify-between pl-3 pr-2 {open
        ? 'text-content-primary'
        : 'text-content-secondary'} {buttonClass}"
    >
      <slot name="selected-option" {selected}>
        <span class="">{selected.label}</span>
      </slot>

      <ExpandIcon
        expanded={inverted ? open : !open}
        class="{open
          ? 'text-content-primary'
          : 'text-content-tertiary'} ml-2 h-4 w-4"
      />
    </ListboxButton>

    <ListboxOptions
      style="{inverted ? 'bottom: calc(100% + 8px)' : 'top: calc(100% + 8px)'};"
      class="bg-background-secondary absolute right-0 w-full"
    >
      {#each options as opt (opt.value)}
        <ListboxOption
          as="li"
          value={opt}
          disabled={opt.disabled}
          class="label-small hover:bg-background-secondaryHover hover:text-content-primary flex h-10 min-w-full cursor-pointer items-center justify-between px-3 {opt.value ===
          selected.value
            ? 'text-content-primary'
            : 'text-content-secondary'}"
        >
          {#if opt.renderComponent}
            <svelte:component
              this={opt.renderComponent}
              option={opt}
              selected={opt.value === selected.value}
            />
          {:else}
            {opt.label}
          {/if}
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Listbox>
</div>
