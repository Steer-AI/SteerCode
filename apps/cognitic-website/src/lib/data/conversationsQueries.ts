import { Log } from '$lib/core/services/logging';
import type { Conversation } from '$lib/models/types/conversation.type';
import { v4 as uuidv4 } from 'uuid';

export function fetchConversations(): Promise<Conversation[]> {
    // TODO: implement server request
    Log.WARNING('fetchConversations', 'Not implemented');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
              {
                id: '1',
                agent_name: 'Jarvis 2',
                agent_goal:
                  'Make as much profit as possible. You have a limit of $1000 and you want to turn it into the highest possible amount of profit in the least possible time.',
                agent_role: 'Business specialist',
                status: 'running',
                tasks: [
                  {
                    id: uuidv4(),
                    status: 'completed',
                    name: 'Get info about NFT market',
                    result:
                      'Market is not performing well. Investing in NFTs is not recommended',
                    steps: [
                      {
                        status: 'completed',
                        name: 'Get info about Singular',
                        result: 'Number of sales is too low'
                      },
                      {
                        status: 'completed',
                        name: 'Get info about OpenSea',
                        result: 'Number of sales is too low'
                      },
                      {
                        status: 'failed',
                        name: 'Get info about Blur',
                        result: 'API error. Could not retrieve market data'
                      }
                    ]
                  },
                  {
                    id: uuidv4(),
                    status: 'failed',
                    name: 'Get info about Stock market',
                    result:
                      'Unable to get data from the API. Stock market is closed.',
                    steps: []
                  },
                  {
                    id: uuidv4(),
                    status: 'running',
                    name: 'Get info about current business trends',
                    result: null,
                    steps: [
                      {
                        status: 'completed',
                        name: 'Research topic A',
                        result: 'Result for topic A'
                      },
                      {
                        status: 'failed',
                        name: 'Research topic C',
                        result: 'Could not retrieve data'
                      },
                      {
                        status: 'running',
                        name: 'Research topic D',
                        result: null
                      }
                    ]
                  },
                  {
                    id: uuidv4(),
                    status: 'waiting',
                    name: 'Create plan based on harvested knowleadge',
                    result: null,
                    steps: []
                  }
                ]
              },
              {
                id: '2',
                agent_name: 'Jarvis',
                agent_goal: 'Create a poem about climate change',
                agent_role: 'Writer',
                status: 'waiting',
                tasks: [
                  {
                    id: uuidv4(),
                    status: 'waiting',
                    name: 'Get info about topic',
                    result: null,
                    steps: []
                  },
                  {
                    id: uuidv4(),
                    status: 'waiting',
                    name: 'Get info about topic',
                    result: null,
                    steps: []
                  },
                  {
                    id: uuidv4(),
                    status: 'waiting',
                    name: 'Get info about topic',
                    result: null,
                    steps: []
                  }
                ]
              }
            ]);
        }, 1000)
    })
}

export function removeConversation(id: string): Promise<boolean> {
    // TODO: implement server request
    Log.WARNING('removeConversation', 'Not implemented');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 1000)
    })
}

export function newConversation(agentName: string, agentRole: string, agentGoal: string): Promise<Conversation> {
    // TODO: implement server request
    Log.WARNING('newConversation', 'Not implemented');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                id: Math.random().toString(),
                agent_name: agentName,
                agent_goal: agentGoal,
                agent_role: agentRole,
                status: 'waiting',
                tasks: [
                    {id: uuidv4(), status: 'waiting', name: 'Get info about topic', result: null, steps: []},
                ]
            })
        }, 1000)
    })
}