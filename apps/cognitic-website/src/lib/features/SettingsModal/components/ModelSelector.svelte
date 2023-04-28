<script lang="ts">
  import Listbox from '$lib/shared/components/Listbox/Listbox.svelte';
  import type { Option } from '$lib/shared/components/Listbox/types';

  export let value: string;
  const options: Option<string>[] = [
    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
    { label: 'gpt-4', value: 'gpt-4' },
    { label: 'text-davinci-003', value: 'text-davinci-003' },
    { label: 'code-davinci-002', value: 'code-davinci-002' }
  ];
</script>

<Listbox
  selected={{ label: value, value }}
  on:change={({ detail }) => (value = detail.value)}
  {options}
>
  <p slot="label" class="label-small text-content-tertiary mr-3">
    Select a model
  </p>
</Listbox>
