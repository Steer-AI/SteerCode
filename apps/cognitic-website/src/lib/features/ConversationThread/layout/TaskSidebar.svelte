<script lang="ts">
  import { conversationsStore } from '$lib/features/ConversationsSidebar/stores/conversations';
  import type { Conversation, Task } from '$lib/models/types/conversation.type';
  import Divider from '$lib/shared/components/Divider.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import { fade } from 'svelte/transition';
  import NewTask from '../components/NewTask.svelte';
  import TaskWrapper from '../components/TaskWrapper.svelte';
  import autoAnimate from '@formkit/auto-animate';
  import ActionModal from '$lib/shared/components/ActionModal.svelte';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType } from '$lib/models/enums/notifications';

  export let conversation: Conversation;

  let dialogEl: HTMLDialogElement;
  let taskToDelete: Task | null = null;

  function handleAddNewTask(index: number, taskName: string) {
    conversationsStore.addTaskToIndex(conversation.id, index, taskName);
  }

  function handleDeleteTask(index: number, task: Task) {
    console.log('delete task', index, task, dialogEl);
    taskToDelete = task;
    dialogEl && dialogEl.showModal();
  }
</script>

<!-- tasks sidebar-->
<aside class="hidden flex-shrink-0 md:flex" in:fade>
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <h3 class="headline-small flex-1">Tasks</h3>
      {#if conversation.status === 'running'}
        <Spinner class="text-content-secondary h-6 w-6" />
      {/if}
    </div>

    <Divider />

    <div class="flex-1 overflow-y-scroll" dir="rtl">
      <div dir="ltr" use:autoAnimate={{ duration: 200 }}>
        {#each conversation.tasks as task, i (task.id)}
          <TaskWrapper
            {task}
            on:delete={(e) => handleDeleteTask(i, e.detail)}
          />
        {/each}
      </div>
    </div>

    <Divider />
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <NewTask
        on:add={(e) =>
          handleAddNewTask(conversation.tasks.length + 1, e.detail)}
      />
    </div>
  </div>
  <Divider vertical class="h-full" />
</aside>

<ActionModal
  bind:dialogEl
  title="Delete task?"
  description="Confirm you want to delete following task: <br/> <b>{taskToDelete?.name ||
    'unknown task'}</b>"
  confirmText="Yes"
  cancelText="No"
  on:close={() => {
    if (taskToDelete === null) {
      return;
    }

    if (dialogEl.returnValue === 'confirm') {
      const index = conversation.tasks.findIndex(
        (task) => task.id === taskToDelete.id
      );
      if (index === -1) {
        notificationStore.addNotification({
          type: NotificationType.GeneralError,
          text: 'Task not found',
          removeAfter: 3000
        });
        return;
      }
      conversationsStore.removeTaskByIndex(conversation.id, index);
    }
    taskToDelete = null;
  }}
/>
