<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';
  import { fade } from 'svelte/transition';
  import ConversationActions from '../components/ConversationActions.svelte';
  import type { Agent } from '$lib/models/classes/Agent.class';
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import { NotificationType, Position } from '$lib/models/enums/notifications';

  export let agent: Agent;

  async function handleStopAgent() {
    const success = await agent.stop();
    if (!success) {
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        position: Position.BottomRight,
        message: `Failed stop agent ${agent.value.name}. Try again please.`,
        removeAfter: 3000
      });
    }
  }

  async function handleApproveTasks() {
    const success = await agent.approveTasks();
    if (!success) {
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        position: Position.BottomRight,
        message: 'Failed to approve tasks. Try again please.',
        removeAfter: 3000
      });
    }
  }
</script>

<!--  conversation thread -->
<section class="flex flex-1 flex-col overflow-hidden" in:fade>
  <!-- agent role -->
  <h3
    title={$agent.name}
    class="bg-background-primary headline-large relative flex h-14 flex-shrink-0 cursor-default items-center overflow-hidden overflow-ellipsis whitespace-nowrap px-3"
  >
    {$agent.name}

    <div
      class="from-background-primary absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l"
    />
  </h3>

  <Divider />

  <!-- agent goal -->
  <div class="flex-shrink-0 px-3 py-1.5">
    <span class="label-small text-content-secondary">GOAL:</span>
    <p class="body-regular text-content-secondary">
      {$agent.goal}
    </p>
  </div>

  <Divider />

  <!-- agent messages / progress -->
  <div class="my-1.5 flex-1 px-3">
    TODO
    <!-- TODO: implement -->
  </div>

  <Divider />
  <ConversationActions
    agentStatus={$agent.status}
    on:approve={handleApproveTasks}
    on:stop={handleStopAgent}
  />
</section>
