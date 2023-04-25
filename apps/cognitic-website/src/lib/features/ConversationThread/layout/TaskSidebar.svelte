<script lang="ts">
  import { Log } from '$lib/core/services/logging';
  import { conversationsStore } from '$lib/features/ConversationsSidebar/stores/conversations';
  import type { Conversation, Task } from '$lib/models/types/conversation.type';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import Tooltip from '$lib/shared/components/Tooltip.svelte';
  import NewTask from '../components/NewTask.svelte';
  import TaskWrapper from '../components/TaskWrapper.svelte';
  import autoAnimate from '@formkit/auto-animate';

  export let conversation: Conversation;

  let editMode = false;
  let taskSnapshot: Task[] = [];

  function handleEditModeChange() {
    if (!editMode)
      taskSnapshot = JSON.parse(JSON.stringify(conversation.tasks));
    else {
      Log.DEBUG(
        'TaskSidebar',
        'handleEditModeChange',
        'restore snapshot',
        taskSnapshot
      );
      conversationsStore.restoreTasks(conversation.id, taskSnapshot);
    }
    editMode = !editMode;
  }

  function handleAddNewTask(index: number, taskName: string) {
    conversationsStore.addTaskToIndex(conversation.id, index, taskName);
  }

  function handleDeleteTask(index: number) {
    conversationsStore.removeTaskByIndex(conversation.id, index);
  }

  function handleSaveChanges() {
    // TODO: implement
    editMode = false;
  }
</script>

<!-- tasks sidebar-->
<aside class="z-20 flex flex-shrink-0 md:z-auto">
  <div class="bg-background-primary flex w-64 flex-col">
    <div class="flex h-14 flex-shrink-0 items-center px-3">
      <h3 class="headline-small flex-1">Tasks</h3>
      {#if conversation.status === 'running'}
        <Spinner class="text-content-secondary h-6 w-6" />
      {:else if conversation.status === 'waiting'}
        <Button variant="tertiary" size="small" on:click={handleEditModeChange}>
          {editMode ? 'Cancel edit' : 'Edit tasks'}
        </Button>
      {/if}
    </div>

    <Divider />

    <div class="flex-1 overflow-y-scroll" dir="rtl">
      <div dir="ltr" use:autoAnimate>
        {#each conversation.tasks as task, i (task.id)}
          <div class="mx-3 mt-4 flex items-center">
            <TaskWrapper {task} />
            {#if editMode && task.status === 'waiting'}
              <Tooltip>
                <button slot="trigger" on:click={() => handleDeleteTask(i)}>
                  <BinIcon
                    class="text-content-tertiary hover:text-error h-3 w-3"
                  />
                </button>
                <svelte:fragment slot="tooltip">Delete task</svelte:fragment>
              </Tooltip>
            {/if}
          </div>
          {#if task.status === 'waiting' && editMode}
            <NewTask on:add={(e) => handleAddNewTask(i + 1, e.detail)} />
          {/if}
        {/each}
      </div>
    </div>

    {#if editMode}
      <Divider />
      <div class="flex h-14 flex-shrink-0 items-center px-3">
        <Button
          variant="secondary"
          class="w-full"
          size="medium"
          on:click={handleSaveChanges}
        >
          <DoneIcon class="mr-1 h-3 w-3" />
          Save changes
        </Button>
      </div>
    {/if}
  </div>
  <Divider vertical class="h-full" />
</aside>
