<script lang="ts">
  import Listbox from '$lib/shared/components/Listbox/Listbox.svelte';
  import type { Option } from '$lib/shared/components/Listbox/types';
  import { _ } from 'svelte-i18n';

  export let value: string;
  const options: Option<string>[] = [
    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
    { label: 'gpt-4', value: 'gpt-4' }
  ];
</script>

<Listbox
  selected={{ label: value, value }}
  on:change={({ detail }) => (value = detail.value)}
  {options}
  listboxClass="w-full"
>
  <p
    slot="label"
    class="label-small text-content-tertiary mr-3 whitespace-nowrap"
  >
    {$_('settings.modelSelector.label')}
  </p>
</Listbox>
