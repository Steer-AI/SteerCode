import { Log } from '$lib/core/services/logging';
import {
  deleteAgentTask,
  getAgent,
  postApproveAgent,
  putNewTasks,
  putStopAgent
} from '$lib/data/agentQueries';
import { withLogger } from '$lib/shared/utils/decorators';
import {
  writable,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable
} from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { AgentDTO } from '../types/agent.type';
import type { Task } from '../types/task.type';

export class Agent implements Readable<AgentDTO> {
  readonly value: AgentDTO;
  readonly store: Writable<AgentDTO>;

  constructor(initialValue: AgentDTO) {
    this.value = initialValue;
    this.store = writable<AgentDTO>(initialValue);
  }

  _restore(valueKey: keyof AgentDTO, snapshot: any) {
    this.value[valueKey] = snapshot;
    this.store.set(this.value);
  }

  subscribe(
    run: Subscriber<AgentDTO>,
    invalidate?: ((value?: AgentDTO | undefined) => void) | undefined
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  @withLogger()
  async approveTasks(): Promise<boolean> {
    const snapshot = this.value.status;
    // optimistic update
    this.value.status = 'running';
    this.store.set(this.value);

    const response = await postApproveAgent(this.value);

    if (!response) {
      Log.DEBUG(
        'Agent.approveTasks',
        'failed to approve tasks. Restore snapshot'
      );
      this._restore('status', snapshot);
      return false;
    }

    // actual update
    this.value.status = response.status;
    this.value.tasks = response.tasks;
    this.store.set(this.value);
    return true;
  }

  @withLogger()
  async addTask(taskName: string): Promise<boolean> {
    const snapshot = [...this.value.tasks];

    const task: Task = {
      id: uuidv4(),
      description: taskName,
      status: 'waiting',
      result: null,
      steps: []
    };

    this.value.tasks.push(task);
    this.store.set(this.value);

    const success = await putNewTasks(this.value.id, [task]);

    if (!success) {
      Log.DEBUG('Agent.addTask', 'failed to add task. Restore snapshot');
      this._restore('tasks', snapshot);
    }

    return success;
  }

  @withLogger()
  async removeTask(taskId: string): Promise<boolean> {
    const snapshot = this.value.tasks;

    this.value.tasks = this.value.tasks.filter((t) => t.id !== taskId);
    this.store.set(this.value);

    const success = await deleteAgentTask(this.value.id, taskId);

    if (!success) {
      Log.DEBUG('Agent.removeTask', 'failed to remove task. Restore snapshot');
      this._restore('tasks', snapshot);
    }
    return success;
  }

  @withLogger()
  async stop(): Promise<boolean> {
    const snapshot = this.value.status;

    this.value.status = 'failed';
    this.store.set(this.value);
    const success = await putStopAgent(this.value.id);

    if (!success) {
      Log.DEBUG('Agent.stop', 'failed to stop agent. Restore snapshot');
      this._restore('status', snapshot);
    }

    return success;
  }

  @withLogger()
  async fetchAgentState(): Promise<AgentDTO | null> {
    const response = await getAgent(this.value.id);
    if (response) {
      this.value.status = response.status;
      this.value.tasks = response.tasks;
      this.store.set(this.value);
    }
    return response;
  }
}
