<script lang="ts">
  import { goto } from '$app/navigation';
  import { Log } from '$lib/core/services/logging';
  import { agentStore } from '$lib/shared/stores/agents';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import type { NewAgentDTO } from '$lib/models/types/agent.type';
  import Button from '$lib/shared/components/Button.svelte';
  import Divider from '$lib/shared/components/Divider.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import Spinner from '$lib/shared/components/Spinner.svelte';
  import Switch from '$lib/shared/components/Switch.svelte';
  import TextAreaField from '$lib/shared/components/TextAreaField.svelte';
  import Tooltip from '$lib/shared/components/Tooltip.svelte';
  import type { Snapshot } from './$types';
  import { trackEvent } from '$lib/core/services/tracking';

  const defaultValues: NewAgentDTO = {
    name: '',
    goal: '',
    role: '',
    tasks: [],
    search_mode: true
  };

  let newAgent: NewAgentDTO = JSON.parse(JSON.stringify(defaultValues));

  // form variables
  let userTasks = false;
  let newTaskAreaComp: TextAreaField;
  let newTaskValue: string | undefined = undefined;
  let pendingRequest = false;

  async function handleSubmit(e: Event) {
    if (pendingRequest) return;
    pendingRequest = true;
    Log.DEBUG('NewAgentForm.handleSubmit', newAgent);
    const agent = await agentStore.add(newAgent);
    pendingRequest = false;
    if (!agent) return;

    trackEvent('Create conversation', {
      goal: agent.value.goal,
      name: agent.value.name,
      conversationId: agent.value.id
    });
    goto(`/chat/${agent.value.id}`);
  }

  function handleReset(e: Event) {
    Log.DEBUG('NewAgentForm.handleReset');
    userTasks = false;
    newTaskValue = undefined;
    newAgent = JSON.parse(JSON.stringify(defaultValues));
  }

  function handleAddTask() {
    if (newTaskValue) {
      if (newAgent.tasks.includes(newTaskValue)) {
        notificationStore.addNotification({
          message: 'Cannot have same tasks multiple times',
          type: NotificationType.GeneralError,
          removeAfter: 3000,
          position: Position.BottomRight
        });
      } else {
        newAgent.tasks.push(newTaskValue);
        newAgent = newAgent;
        newTaskAreaComp && newTaskAreaComp.focus();
      }
      newTaskValue = undefined;
    }
  }

  function handleDeleteTask(index: number) {
    newAgent.tasks.splice(index, 1);
    newAgent = newAgent;
  }

  export const snapshot: Snapshot = {
    capture: () => newAgent,
    restore: (value: NewAgentDTO) => (newAgent = value)
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
        bind:value={newAgent.name}
        name="name"
        placeholder="Your agent name. e.g. Jarvis"
        class="body-regular h-8 px-3"
        labelClass="flex items-start flex-col"
        required
      >
        <div slot="label" class="label-small-plus text-content-secondary mb-2">
          Agent name
        </div>
      </InputField>

      <TextAreaField
        bind:value={newAgent.goal}
        name="goal"
        placeholder="What is your agent's goal? e.g. Research and summarize top 10 tech startups in the world in current year"
        class="body-regular w-full p-3"
        style="min-height: 128px; max-height: 512px;"
        labelClass="flex items-start flex-col"
        maxlength={500}
        resize="vertical"
        rows={5}
        required
      >
        <div slot="label" class="label-small-plus text-content-secondary mb-2">
          Agent goal
        </div>
      </TextAreaField>

      <div>
        <Switch
          label="Enable search mode"
          size="large"
          labelClassName="label-small-plus text-content-secondary"
          hiddenInputName="search_mode"
          bind:active={newAgent.search_mode}
        />
        <p class="text-content-tertiary body-small mt-2">
          Enable your agent to search for information on the web. And come to
          the conclusion based on the information it finds.
        </p>
      </div>

      <div>
        <Switch
          bind:active={userTasks}
          label="User defined tasks"
          size="large"
          labelClassName="label-small-plus text-content-secondary"
          hiddenInputName="user_tasks"
        />
        <p class="text-content-tertiary body-small mt-2">
          Give the agent a tasks to perform based on your objective. Agent will
          attempt to solve these tasks and come to the conclusion.
        </p>
      </div>

      <Divider class="last:hidden" />

      {#if userTasks}
        <div class="flex h-14 flex-shrink-0 items-center">
          <Button
            type="secondary"
            size="medium"
            disabled={!newTaskValue}
            on:click={handleAddTask}
            class="w-28"
          >
            <PlusIcon class="mr-1 h-3 w-3" />
            Add task
          </Button>
        </div>

        <TextAreaField
          bind:this={newTaskAreaComp}
          bind:value={newTaskValue}
          class="body-regular w-full p-3"
          style="min-height: 128px; max-height: 512px;"
          labelClass="flex items-start flex-col"
          placeholder="Describe the task. e.g. Create a SWAT analysis of the startups found."
          maxlength={200}
          resize="vertical"
          rows={5}
        >
          <div
            slot="label"
            class="label-small-plus text-content-secondary mb-2"
          >
            Task description
          </div>
        </TextAreaField>

        <Divider />
      {/if}

      {#if newAgent.tasks.length}
        <div class="flex items-center">
          <h3 class="headline-small text-content-secondary">Your tasks</h3>
          {#if !userTasks}
            <p class="body-small text-content-tertiary ml-3 inline-block">
              (enable "USER DEFINED TASKS" to use your tasks)
            </p>
          {/if}
        </div>

        <ul class:opacity-50={!userTasks}>
          {#each newAgent.tasks as task, i (task)}
            <li class="group relative mt-4">
              <p
                class="body-small text-content-primary bg-background-secondary w-full px-3 py-1.5"
              >
                {task}
              </p>
              <input type="hidden" name="task_{i}" value={task} />
              <Tooltip
                class="bg-background-secondary absolute -right-1 -top-2 hidden items-center rounded-md p-1 group-hover:flex"
              >
                <button
                  slot="trigger"
                  type="button"
                  on:click={() => handleDeleteTask(i)}
                >
                  <BinIcon
                    class="text-content-tertiary hover:text-error h-4 w-4"
                  />
                  <div class="sr-only">Delete task</div>
                </button>
                <svelte:fragment slot="tooltip">Delete task</svelte:fragment>
              </Tooltip>
            </li>
          {/each}
        </ul>
      {/if}
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
