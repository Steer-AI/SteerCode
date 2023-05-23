import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';
import type { RepositoryOption } from '$lib/models/types/conversation.type';

export function getAvailableRepositories(): Promise<RepositoryOption[]> {
  return responseWithErrorHandeling<RepositoryOption[]>(
    customFetch(`/configuration/repositories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }),
    [
      {
        name: 'LangChain',
        url: 'https://github.com/hwchase17/langchain',
        version: undefined
      }
    ],
    'Failed to get available repositories'
  );
}
