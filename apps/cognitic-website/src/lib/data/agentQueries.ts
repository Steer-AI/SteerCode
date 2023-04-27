import { Log } from '$lib/core/services/logging';
import type { AgentDTO, NewAgentDTO } from '$lib/models/types/agent.type';
import type { Task } from '$lib/models/types/task.type';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all agents created by the user
 * @returns List of agents
 *  - fallback: empty list (server returns error)
 */
export function getAgents(): Promise<AgentDTO[]> {
  // TODO: implement server request
  Log.WARNING('getAgents', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Jarvis 2',
          goal: 'Make as much profit as possible. You have a limit of $1000 and you want to turn it into the highest possible amount of profit in the least possible time.',
          role: 'Business specialist',
          status: 'running',
          tasks: [
            {
              id: uuidv4(),
              status: 'completed',
              description: 'Get info about NFT market',
              result:
                'Market is not performing well. Investing in NFTs is not recommended',
              steps: [
                {
                  status: 'completed',
                  description: 'Get info about Singular',
                  result: 'Number of sales is too low'
                },
                {
                  status: 'completed',
                  description: 'Get info about OpenSea',
                  result: 'Number of sales is too low'
                },
                {
                  status: 'failed',
                  description: 'Get info about Blur',
                  result: 'API error. Could not retrieve market data'
                }
              ]
            },
            {
              id: uuidv4(),
              status: 'waiting',
              description: 'Get info about topic XYZ',
              result: null,
              steps: [
                {
                  status: 'waiting',
                  description: 'Research topic A',
                  result: null
                },
                {
                  status: 'waiting',
                  description: 'Research topic B',
                  result: null
                },
                {
                  status: 'waiting',
                  description: 'Research topic C',
                  result: null
                }
              ]
            },
            {
              id: uuidv4(),
              status: 'failed',
              description: 'Get info about Stock market',
              result:
                'Unable to get data from the API. Stock market is closed.',
              steps: []
            },
            {
              id: uuidv4(),
              status: 'running',
              description: 'Get info about current business trends',
              result: null,
              steps: [
                {
                  status: 'completed',
                  description: 'Research topic A',
                  result: 'Result for topic A'
                },
                {
                  status: 'failed',
                  description: 'Research topic C',
                  result: 'Could not retrieve data'
                },
                {
                  status: 'running',
                  description: 'Research topic D',
                  result: null
                }
              ]
            },
            {
              id: uuidv4(),
              status: 'waiting',
              description: 'Create plan based on harvested knowleadge',
              result: null,
              steps: []
            }
          ]
        },
        {
          id: '2',
          name: 'Jarvis',
          goal: 'Create a poem about climate change',
          role: 'Writer',
          status: 'waiting',
          tasks: [
            {
              id: uuidv4(),
              status: 'waiting',
              description: 'Get info about topic',
              result: null,
              steps: []
            },
            {
              id: uuidv4(),
              status: 'waiting',
              description: 'Get info about topic',
              result: null,
              steps: []
            },
            {
              id: uuidv4(),
              status: 'waiting',
              description: 'Get info about topic',
              result: null,
              steps: []
            }
          ]
        }
      ]);
    }, 1000);
  });
}

/**
 * Get a specific agent
 * @param id agent ID to get
 * @returns Agent with the provided ID
 *  - fallback to null (server returns error)
 */
export function getAgent(id: string): Promise<AgentDTO | null> {
  //TODO: implement server request
  Log.WARNING('getAgent', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
}

/**
 * Stop the agent and deletes it from the database and everything associated with this agent.
 * @param id agent ID to delete
 * @returns boolean indicating if the agent was deleted
 *  - fallback to false (server returns error)
 */
export function deleteAgent(id: string): Promise<boolean> {
  // TODO: implement server request
  Log.WARNING('deleteAgent', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

/**
 * Create a new agent on the server.
 * The agent's ID will be generated by the server.
 * The agent will be created with the status 'waiting'.
 * The agent will be created with the provided tasks.
 *  - Additional tasks might be generated if provided tasks are not
 *    sufficient to complete the goal.
 * The agent will be created with the tasks in the 'waiting' status.
 * The tasks will not have any steps yet.
 * @param agent agent that will be created.
 * @returns the created agent.
 *  - Fallback to null (server returns error)
 */
export function postNewAgent(agent: NewAgentDTO): Promise<AgentDTO | null> {
  // TODO: implement server request
  Log.WARNING('postNewAgent', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: uuidv4(),
        name: agent.name,
        goal: agent.goal,
        role: agent.role,
        status: 'waiting',
        tasks: agent.tasks.map((t) => {
          return {
            id: uuidv4(),
            status: 'waiting',
            description: t,
            result: null,
            steps: []
          };
        })
      });
    }, 5000);
  });
}

/**
 * Approve the current agent. The agent will start/continue execution.
 * The agent's status will be updated to 'running'.
 * At least one task will update it's status to 'running'.
 * @param agent agent that will be executed.
 * @returns agent in a new state. With updated tasks. New tasks might be generated if the
 * current tasks are not sufficient to complete the goal. At least one task will be updated
 * to 'completed'/'failed'
 *  - Fallback to null (server returns error)
 */
export function postApproveAgent(agent: AgentDTO): Promise<AgentDTO | null> {
  // TODO: implement server request
  Log.WARNING('postApproveAgent', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        ...agent,
        status: 'waiting',
        tasks: agent.tasks.map((t) => {
          return {
            ...t,
            status: 'waiting',
            steps: t.steps.map((s) => {
              return {
                ...s,
                status: 'waiting'
              };
            })
          };
        })
      });
    }, 1000);
  });
}

/**
 * Stop the agent
 * @param id agent ID to stop
 * @returns boolean indicating if the agent was stopped
 *  - fallback to false (server returns error)
 */
export function putStopAgent(id: string): Promise<boolean> {
  // TODO: implement server request
  Log.WARNING('putStopAgent', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

/**
 * Delete (mark tasks as deleted) the agent's task. Agent must not include
 * these tasks in it's state. Calling "getAgent" should return the agent
 * without these tasks.
 * @param agentId agent ID to delete the task from
 * @param taskId task ID to delete
 * @returns boolean indicating if operation was successful
 *  - fallback to false (server returns error)
 */
export function deleteAgentTask(
  agentId: string,
  taskId: string
): Promise<boolean> {
  // TODO: implement server request
  Log.WARNING('deleteAgentTask', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

/**
 * Add new tasks to the agent. Agent must include these tasks in it's state.
 * Calling "getAgent" should return the agent with these tasks included.
 * @param agentId agent ID to add the task to
 * @param tasks list of tasks to add
 * @returns boolean indicating if operation was successful
 *  - fallback to false (server returns error)
 */
export function putNewTasks(agentId: string, tasks: Task[]): Promise<boolean> {
  // TODO: implement server request
  Log.WARNING('putAddNewTasks', 'Not implemented');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
