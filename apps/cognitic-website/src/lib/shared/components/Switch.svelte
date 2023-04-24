<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onToggle(event: CustomEvent<boolean>) {
    dispatch('toggle', event.detail);
    active = event.detail;
  }

  export let active = false;
  export let label: string | null = null;
  export let disabled: boolean | undefined = false;
  export let labelClassName: string = '';
  export let size: 'small' | 'large' = 'large';
</script>

<div class="flex items-center">
  {#if label}
    <p class="label-small text-content-tertiary pr-2 {labelClassName}">
      {label}
    </p>
  {/if}

  <Switch
    {disabled}
    checked={active}
    on:change={onToggle}
    class={`relative my-0.5 box-border border ${
      size === 'large' ? 'h-3 w-6' : 'h-2 w-5'
    } 
    ${disabled ? 'opacity-50' : ''}
    ${
      active
        ? 'border-primary-darker bg-primary'
        : 'border-stroke-secondary bg-background-secondary hover:bg-background-secondaryHover'
    }`}
    title={`Toggle switch ${active ? 'off' : 'on'}`}
  >
    <span class="sr-only">{`Toggle switch ${active ? 'off' : 'on'}`}</span>
    <span
      class="bg-background-inverse absolute -top-[3px] left-0 h-4 w-2.5 transition-transform {size}"
      class:toggle-on={active}
      class:toggle-off={!active}
    />
  </Switch>
</div>

<style>
  .toggle-on.large {
    transform: translateX(14px);
  }
  .toggle-on.small {
    transform: translateX(10px);
  }

  .toggle-off {
    transform: translateX(0);
  }
</style>
