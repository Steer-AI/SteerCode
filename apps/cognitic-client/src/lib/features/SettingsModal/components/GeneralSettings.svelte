<script lang="ts">
  import type { ModalSettingsOptions } from '$lib/models/types/settings.type';
  import EyeIcon from '$lib/shared/components/Icons/EyeIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import Switch from '$lib/shared/components/Switch.svelte';
  import { _ } from 'svelte-i18n';

  export let settingOptions: ModalSettingsOptions;

  let inputType: 'text' | 'password' = 'password';
</script>

<div class="text-content-secondary body-regular flex flex-col gap-6">
  <p class="headline-small text-content-primarySub mb-4">
    {$_('settings.general.description')}
  </p>

  <!-- API KEY INPUT -->
  <InputField
    bind:value={settingOptions.openaiAPIKey}
    type={inputType}
    placeholder={$_('settings.general.apiKeyInput.placeholder')}
    class="body-regular !bg-background-secondaryHover h-8 px-3"
    labelClass="flex items-start flex-col"
  >
    <p
      slot="label"
      class="label-small text-content-tertiary flex-shrink-0 pb-2"
    >
      {$_('settings.general.apiKeyInput.label')}
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
  <p class="text-content-secondary body-small mb-4">
    {$_('settings.general.apiKeyInput.helperText')}
  </p>

  <!-- PERSIST API KEY SWITCH -->
  <Switch
    bind:checked={settingOptions.persistApiKey}
    label={$_('settings.general.persistence.label')}
    labelClassName="mr-auto"
  />
  <p class="text-content-secondary body-small mb-4">
    {$_('settings.general.persistence.helperText')}
  </p>
</div>
