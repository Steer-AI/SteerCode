<script lang="ts">
  import Switch from '$lib/shared/components/Switch.svelte';
  import { _ } from 'svelte-i18n';

  export let value: boolean;
</script>

<Switch
  bind:checked={value}
  label={$_('settings.apiKeyInput.persistentLabel')}
  labelClassName="mr-auto"
/>
