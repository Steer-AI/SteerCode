<script lang="ts">
  import type { Task } from '$lib/models/types/conversation.type';
  import Divider from '$lib/shared/components/Divider.svelte';
  import ClockIcon from '$lib/shared/components/Icons/ClockIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import WarningIcon from '$lib/shared/components/Icons/WarningIcon.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import Tooltip from '$lib/shared/components/Tooltip.svelte';
  import { createEventDispatcher } from 'svelte';
  import TaskStep from './TaskStep.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';

  export let task: Task;

  const dispatch = createEventDispatcher<{ delete: Task }>();

  const popperOptions = {
    placement: 'auto',
    strategy: 'fixed'
  } as const;
</script>

<div
  class="task-wrapper bg-background-secondary group relative mx-3 mt-4 grid items-center px-3 py-1.5"
>
  <p class="body-small text-content-primary">{task.name}</p>

  <div class="ml-2">
    {#if task.status === 'completed'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <DoneIcon slot="trigger" class="text-success h-4 w-4" />
        <svelte:fragment slot="tooltip">
          {task.result}
        </svelte:fragment>
      </Tooltip>
    {:else if task.status === 'running'}
      <Spinner class="text-content-secondary h-4 w-4" />
    {:else if task.status === 'failed'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <WarningIcon slot="trigger" class="text-error h-4 w-4" />
        <svelte:fragment slot="tooltip">
          {task.result}
        </svelte:fragment>
      </Tooltip>
    {:else if task.status === 'waiting'}
      <Tooltip {popperOptions} tooltipClass="max-w-xs">
        <ClockIcon slot="trigger" class="text-content-tertiary h-4 w-4" />
        <svelte:fragment slot="tooltip">
          This taks is waiting to be executed
        </svelte:fragment>
      </Tooltip>
    {/if}
  </div>

  {#if task.status === 'waiting'}
    <Tooltip
      class="bg-background-secondary absolute -right-1 -top-2 hidden items-center rounded-md p-1 group-hover:flex"
    >
      <button slot="trigger" on:click={() => dispatch('delete', task)}>
        <BinIcon class="text-content-tertiary hover:text-error h-4 w-4" />
      </button>
      <svelte:fragment slot="tooltip">Delete task</svelte:fragment>
    </Tooltip>
  {/if}

  {#if task.steps.length}
    <Divider class="col-span-3 mt-3" />
    <div class="col-span-2">
      {#each task.steps as step}
        <TaskStep {step} />
        <Divider class="ml-3 last:hidden" />
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .task-wrapper {
    grid-template-columns: 1fr min-content min-content;
  }
</style>
