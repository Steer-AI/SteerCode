<script lang="ts">
  import EyeIcon from '$lib/shared/components/Icons/EyeIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import { _ } from 'svelte-i18n';

  export let value: string;
  let inputType: 'text' | 'password' = 'password';
</script>

<InputField
  bind:value
  type={inputType}
  placeholder={$_('settings.apiKeyInput.label')}
  class="body-regular !bg-background-secondaryHover h-8 px-3"
  labelClass="flex items-start flex-col"
>
  <p slot="label" class="label-small text-content-tertiary flex-shrink-0 pb-2">
    {$_('settings.apiKeyInput.label')}
  </p>

  <button
    slot="sufix-icon"
    on:click={() => {
      inputType = inputType === 'text' ? 'password' : 'text';
    }}
    class="{inputType === 'password'
      ? 'text-content-secondary hover:text-content-primary'
      : 'text-primary'} z-10"
  >
    <EyeIcon class="h-4 w-4" />
  </button>
</InputField>
