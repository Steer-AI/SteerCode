<script lang="ts">
  import type { TaskStep } from '$lib/models/types/task.type';
  import ClockIcon from '$lib/shared/components/Icons/ClockIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import WarningIcon from '$lib/shared/components/Icons/WarningIcon.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import Tooltip from '$lib/shared/components/Tooltip.svelte';

  export let step: TaskStep;

  const popperOptions = {
    placement: 'auto',
    strategy: 'fixed'
  } as const;
</script>

<div
  class="task-wrapper bg-background-secondary relative my-2 grid py-1.5 pl-3"
>
  <p class="body-small text-content-primarySub">{step.description}</p>

  <div class="">
    {#if step.status === 'completed'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <DoneIcon slot="trigger" class="text-success h-4 w-4" />
        <svelte:fragment slot="tooltip">
          {step.result}
        </svelte:fragment>
      </Tooltip>
    {:else if step.status === 'running'}
      <Spinner class="text-content-secondary h-4 w-4" />
    {:else if step.status === 'failed'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <WarningIcon slot="trigger" class="text-error h-4 w-4" />
        <svelte:fragment slot="tooltip">
          {step.result}
        </svelte:fragment>
      </Tooltip>
    {:else if step.status === 'waiting'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <ClockIcon slot="trigger" class="text-content-tertiary h-4 w-4" />
        <svelte:fragment slot="tooltip">
          This taks is waiting to be executed
        </svelte:fragment>
      </Tooltip>
    {/if}
  </div>
</div>

<style lang="postcss">
  .task-wrapper {
    grid-template-columns: 1fr min-content;
  }
</style>
