<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onToggle(event: CustomEvent<boolean>) {
    dispatch('toggle', event.detail);
    checked = event.detail;
  }

  export let checked = false;
  export let label: string | null = null;
  export let disabled: boolean | undefined = false;
  export let labelClassName: string = '';
  export let size: 'small' | 'large' = 'large';
  export let hiddenInputName: string | undefined = undefined;
</script>

<div class="flex items-center {$$props.class || ''}">
  {#if label}
    <p class="label-small text-content-tertiary pr-2 {labelClassName}">
      {label}
    </p>
  {/if}

  <Switch
    {disabled}
    {checked}
    on:change={onToggle}
    class={`relative my-0.5 box-border border ${
      size === 'large' ? 'h-3 w-6' : 'h-2 w-5'
    } 
    ${disabled ? 'opacity-50' : ''}
    ${
      checked
        ? 'border-primary-darker bg-primary'
        : 'border-stroke-secondary bg-background-secondary hover:bg-background-secondaryHover'
    }`}
    title={`Toggle switch ${checked ? 'off' : 'on'}`}
  >
    <span class="sr-only">{`Toggle switch ${checked ? 'off' : 'on'}`}</span>
    <span
      class="bg-background-inverse absolute -top-[3px] left-0 h-4 w-2.5 transition-transform {size}"
      class:toggle-on={checked}
      class:toggle-off={!checked}
    />
  </Switch>

  {#if hiddenInputName}
    <input type="hidden" name={hiddenInputName} value={checked} />
  {/if}
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
