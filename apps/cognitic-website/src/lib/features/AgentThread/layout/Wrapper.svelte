<script lang="ts">
  import ConversationMain from '$lib/features/AgentThread/layout/ConversationMain.svelte';
  import TaskSidebar from '$lib/features/AgentThread/layout/TaskSidebar.svelte';
  import type { Agent } from '$lib/models/classes/Agent.class';
  import { onMount, onDestroy } from 'svelte';

  export let agent: Agent;

  let intervalId: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    agent.fetchAgentState();

    intervalId = setInterval(() => {
      if (agent.value.status === 'running') {
        agent.fetchAgentState();
      }
    }, 5000);
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<TaskSidebar {agent} />
<ConversationMain {agent} />
