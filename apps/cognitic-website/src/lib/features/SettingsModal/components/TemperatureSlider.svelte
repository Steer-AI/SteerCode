<script lang="ts">
  import Slider from '$lib/shared/components/Slider/Slider.svelte';
  import { _ } from 'svelte-i18n';

  export let value: number;
</script>

<div class="flex flex-col">
  <p class="label-small text-content-tertiary flex-shrink-0 pb-2">
    {$_('settings.temperatureSlider.label')}
  </p>

  <div class="flex items-center justify-between">
    <div class="w-3/4">
      <Slider min={0} max={1} step={0.05} bind:value numDecimals={2} />
    </div>

    <div class="text-content-tertiary mono-small mr-3">{value}</div>
  </div>
</div>
