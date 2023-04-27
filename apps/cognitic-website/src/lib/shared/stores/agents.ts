import { Log } from '$lib/core/services/logging';
import { deleteAgent, getAgents, postNewAgent } from '$lib/data/agentQueries';
import { notificationStore } from '$lib/features/Notifications/store/notifications';
import { Agent } from '$lib/models/classes/Agent.class';
import { NotificationType, Position } from '$lib/models/enums/notifications';
import type { NewAgentDTO } from '$lib/models/types/agent.type';
import type { DataStore } from '$lib/models/types/store.type';
import { derived, writable, type Readable } from 'svelte/store';

function createAgentsStore(): DataStore<Agent, NewAgentDTO> {
  const _agents = writable<Agent[]>([]);

  async function remove(id: string): Promise<boolean> {
    Log.DEBUG('createAgentsStore.remove', id);
    let removedAgent: Agent | null = null;

    // optimistic update
    _agents.update((conversations) => {
      const index = conversations.findIndex((agent) => agent.value.id === id);
      if (index === -1) return conversations;
      removedAgent = conversations[index];
      conversations.splice(index, 1);
      return conversations;
    });
    const success = await deleteAgent(id);

    // rollback if failed + emit notification
    if (!success && removedAgent !== null) {
      _agents.update((conversations) => {
        conversations.push(removedAgent!);
        return conversations;
      });
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: 'Failed to delete agent',
        removeAfter: 5000,
        position: Position.BottomRight
      });
    }

    // emit notification
    if (success) {
      notificationStore.addNotification({
        type: NotificationType.GeneralSuccess,
        message: 'Agent delete',
        removeAfter: 5000,
        position: Position.BottomRight
      });
    }

    return success;
  }

  async function add(agent: NewAgentDTO): Promise<Agent | null> {
    Log.DEBUG('createAgentsStore.add', agent);

    const resp = await postNewAgent(agent);

    if (resp === null) {
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: 'Failed to create agent',
        removeAfter: 5000,
        position: Position.BottomRight
      });
      return null;
    }

    const newAgent = new Agent(resp);
    _agents.update((agents) => {
      agents.push(newAgent);
      return agents;
    });
    notificationStore.addNotification({
      type: NotificationType.GeneralSuccess,
      message: `Agent "${agent.name}" created`,
      removeAfter: 5000,
      position: Position.BottomRight
    });
    return newAgent;
  }

  async function fetchFromServer(): Promise<void> {
    Log.DEBUG('createAgentsStore.fetchFromerver');
    const agents = await getAgents();
    _agents.set(agents.map((a) => new Agent(a)));
  }

  function getById(id: string): Readable<Agent | null> {
    Log.DEBUG('createAgentsStore.getById', id);
    return derived(_agents, ($) => {
      const agent = $.find((a) => a.value.id === id);
      return agent || null;
    });
  }

  return {
    subscribe: _agents.subscribe,
    remove,
    add,
    fetchFromServer,
    getById
  };
}

export const agentStore = createAgentsStore();
