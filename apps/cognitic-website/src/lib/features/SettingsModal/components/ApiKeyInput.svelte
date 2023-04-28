<script lang="ts">
  import EyeIcon from '$lib/shared/components/Icons/EyeIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';

  export let value: string;
  let inputType: 'text' | 'password' = 'password';
</script>

<InputField
  bind:value
  type={inputType}
  placeholder="Your own OpenAI API key"
  class="body-regular !bg-background-secondaryHover h-8 px-3"
  labelClass="flex items-start flex-col"
>
  <p slot="label" class="label-small text-content-tertiary flex-shrink-0 pb-2">
    OpenAI API Key
  </p>

  <button
    slot="sufix-icon"
    on:click={() => {
      inputType = inputType === 'text' ? 'password' : 'text';
    }}
    class:text-content-secondary={inputType === 'password'}
    class:text-primary={inputType === 'text'}
    class="hover:text-content-primary z-10"
  >
    <EyeIcon class="h-4 w-4" />
  </button>
</InputField>
