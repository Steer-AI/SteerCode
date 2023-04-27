<script lang="ts">
  import { goto } from '$app/navigation';
  import { Log } from '$lib/core/services/logging';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import type { Snapshot } from './$types';
  import type { NewConversationDTO } from '$lib/models/types/conversation.type';
  import { conversationsStore } from '$lib/shared/stores/conversations';

  const defaultValues: NewConversationDTO = {
    name: '',
    system_prompt: ''
  };

  let newConversation: NewConversationDTO = JSON.parse(
    JSON.stringify(defaultValues)
  );

  // form variables
  let pendingRequest = false;

  async function handleSubmit(e: Event) {
    if (pendingRequest) return;
    pendingRequest = true;
    Log.DEBUG('NewConversation.handleSubmit', newConversation);
    const agent = await conversationsStore.add(newConversation);
    pendingRequest = false;
    if (!agent) return;
    goto(`/chat/${agent.value.id}`);
  }

  function handleReset(e: Event) {
    Log.DEBUG('NewConversation.handleReset');
    newConversation = JSON.parse(JSON.stringify(defaultValues));
  }

  export const snapshot: Snapshot = {
    capture: () => newConversation,
    restore: (value: NewConversationDTO) => (newConversation = value)
  };
</script>

<section class="flex h-full flex-col items-center justify-center">
  <form
    id="new-agent-form"
    class="w-full flex-1 overflow-y-scroll px-6"
    on:submit|preventDefault={handleSubmit}
    on:reset={handleReset}
  >
    <h1 class="headline-large mt-14 text-center">Create new agent</h1>

    <div class="mx-auto my-14 flex max-w-xl flex-col justify-center gap-6">
      <InputField
        bind:value={newConversation.name}
        name="name"
        placeholder="Your agent name. e.g. Jarvis"
        class="body-regular h-8 w-full px-3"
        labelClass="flex items-start flex-col"
        required
      >
        <div slot="label" class="label-small-plus text-content-secondary mb-2">
          Agent name
        </div>
      </InputField>

      <TextAreaField
        bind:value={newConversation.system_prompt}
        name="goal"
        placeholder="What is your agent's goal? e.g. Research and summarize top 10 tech startups in the world in current year"
        class="body-regular w-full p-3"
        style="min-height: 128px; max-height: 768px;"
        on:input={(e) => {
          e.target.style.height = 0;
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        labelClass="flex items-start flex-col"
        maxlength={2000}
        resize="vertical"
        rows={5}
      >
        <div slot="label" class="label-small-plus text-content-secondary mb-2">
          Agent prompt
        </div>
      </TextAreaField>
    </div>
  </form>

  <Divider class="w-full" />
  <div class="flex h-14 w-full max-w-xl flex-shrink-0 items-center gap-6">
    <Button
      variant="primary"
      size="medium"
      type="submit"
      form="new-agent-form"
      class="w-full"
      disabled={pendingRequest}
    >
      {#if pendingRequest}
        <Spinner class="h-4 w-4" />
      {:else}
        <DoneIcon class="mr-1 h-3 w-3" />
        Create
      {/if}
    </Button>

    <Button
      variant="secondary"
      size="medium"
      type="reset"
      form="new-agent-form"
      class="w-full"
      disabled={pendingRequest}
    >
      <CloseIcon class="mr-1 h-3 w-3" />
      Cancel
    </Button>
  </div>
</section>
