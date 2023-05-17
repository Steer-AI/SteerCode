<script lang="ts">
  import type { ModalSettingsOptions } from '$lib/models/types/settings.type';
  import InputField from '$lib/shared/components/InputField.svelte';
  import Switch from '$lib/shared/components/Switch.svelte';
  import { _ } from 'svelte-i18n';
  import { slide } from 'svelte/transition';

  export let settingOptions: ModalSettingsOptions;
  let useLocalBackend = settingOptions.customBackendUrl !== '';
</script>

<div class="text-content-secondary body-regular flex flex-col gap-6">
  <p class="headline-small text-content-primarySub mb-4">
    {$_('settings.advanced.description')}
  </p>
  <Switch
    bind:checked={useLocalBackend}
    label={$_('settings.advanced.useLocalBackend.label')}
    labelClassName="mr-auto"
  />
  <p class="text-content-secondary body-small mb-4">
    {$_('settings.advanced.useLocalBackend.helperText')}
  </p>

  {#if useLocalBackend}
    <div in:slide={{ duration: 200 }}>
      <!-- LOCAL BACKEND URL -->
      <InputField
        bind:value={settingOptions.customBackendUrl}
        type={'text'}
        placeholder={$_('settings.advanced.customBackendUrlInput.placeholder')}
        class="body-regular !bg-background-secondaryHover h-8 px-3"
        labelClass="flex items-start flex-col"
      >
        <p
          slot="label"
          class="label-small text-content-tertiary flex-shrink-0 pb-2"
        >
          {$_('settings.advanced.customBackendUrlInput.label')}
        </p>
      </InputField>

      <p class="text-content-secondary body-small mb-4">
        {$_('settings.advanced.customBackendUrlInput.helperText')}
      </p>
    </div>
  {/if}
</div>
