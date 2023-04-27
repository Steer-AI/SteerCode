<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import { fade } from 'svelte/transition';
  import NewTask from '../components/NewTask.svelte';
  import TaskWrapper from '../components/TaskWrapper.svelte';
  import autoAnimate from '@formkit/auto-animate';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType } from '$lib/models/enums/notifications';
  import type { Task } from '$lib/models/types/task.type';
  import type { Agent } from '$lib/models/classes/Agent.class';

  export let agent: Agent;

  let dialogEl: HTMLDialogElement;
  let taskToDelete: Task | null = null;

  function handleAddNewTask(taskName: string) {
    agent.addTask(taskName);
  }

  function handleDeleteTask(task: Task) {
    taskToDelete = task;
    dialogEl && dialogEl.showModal();
  }

  function handleConfirmClose() {
    if (taskToDelete === null) {
      return;
    }
    if (dialogEl.returnValue === 'confirm') {
      const removed = agent.removeTask(taskToDelete.id);
      if (!removed) {
        notificationStore.addNotification({
          type: NotificationType.GeneralError,
          message: 'Task not found',
          removeAfter: 3000
        });
        return;
      }
    }
    taskToDelete = null;
  }
</script>

<!-- tasks sidebar-->
<aside class="hidden flex-shrink-0 md:flex" in:fade>
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <h3 class="headline-small flex-1">Tasks</h3>
      {#if $agent.status === 'running'}
        <Spinner class="text-content-secondary h-6 w-6" />
        <span class="text-content-tertiary body-regular ml-1">running...</span>
      {:else if $agent.status === 'waiting'}
        <Spinner class="text-content-secondary h-6 w-6" />
        <span class="text-content-tertiary body-regular ml-1"
          >waiting for approval...</span
        >
      {/if}
    </div>

    <Divider />

    <div class="flex-1 overflow-y-scroll" dir="rtl">
      <div dir="ltr" use:autoAnimate={{ duration: 200 }}>
        {#each $agent.tasks as task (task.id)}
          <TaskWrapper {task} on:delete={(e) => handleDeleteTask(e.detail)} />
        {/each}
      </div>
    </div>

    <Divider />
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <NewTask on:add={(e) => handleAddNewTask(e.detail)} />
    </div>
  </div>
  <Divider vertical class="h-full" />
</aside>

<ActionModal
  bind:dialogEl
  title="Delete task?"
  description="Confirm you want to delete following task: <br/> <b style='margin-top: 8px'>{taskToDelete?.description ||
    'unknown task'}</b>"
  confirmText="Yes"
  cancelText="No"
  class="max-w-sm"
  on:close={handleConfirmClose}
/>
