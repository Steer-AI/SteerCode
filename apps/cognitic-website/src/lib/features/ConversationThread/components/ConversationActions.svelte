<script lang="ts" context="module">
  export type DispatchType = {
    approve: void;
    stop: void;
  };
</script>

<script lang="ts">
  import { Log } from '$lib/core/services/logging';

  import type { Status } from '$lib/models/enums/status';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import Switch from '$lib/shared/components/Switch.svelte';
  import { createEventDispatcher } from 'svelte';

  export let agentStatus: Status;

  let autoApprove = false;
  let dialogEl: HTMLDialogElement;

  const dispatch = createEventDispatcher<DispatchType>();

  function handleStopAgentClick() {
    dialogEl && dialogEl.showModal();
  }

  function handleConfirmClose() {
    if (dialogEl.returnValue === 'confirm') {
      dispatch('stop');
    }
  }

  $: if (autoApprove && agentStatus === 'waiting') {
    Log.DEBUG('auto approve');
    dispatch('approve');
  }
</script>

<div class="mx-3 flex h-14 flex-shrink-0 items-center justify-end gap-6">
  <Switch
    bind:active={autoApprove}
    label="Auto approve tasks"
    class="mr-auto"
  />

  <Button
    variant="primary"
    size="medium"
    disabled={agentStatus !== 'waiting' || autoApprove}
    on:click={() => dispatch('approve')}
  >
    <DoneIcon class="mr-1 h-3 w-3" />
    Approve tasks
  </Button>

  <Button
    variant="tertiary"
    size="medium"
    disabled={agentStatus === 'completed' || agentStatus === 'failed'}
    on:click={handleStopAgentClick}
  >
    <CloseIcon class="mr-1 h-3 w-3" />
    Stop agent
  </Button>
</div>

<ActionModal
  bind:dialogEl
  title="Stop agent?"
  description="Confirm you want to stop your agent"
  confirmText="Yes"
  cancelText="No"
  class="max-w-sm"
  on:close={handleConfirmClose}
/>
