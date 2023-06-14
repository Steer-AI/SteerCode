import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';
import type { RepositoryOption } from '$lib/models/types/conversation.type';
import { writable } from 'svelte/store';

function createRecentRepositoriesStore() {
  const items = writable<RepositoryOption[]>([]);

  function add(item: RepositoryOption) {
    items.update((items) => {
      const index = items.findIndex((i) => i.url === item.url);
      let newItem = item;
      if (index !== -1) {
        // Item already exists, move it to the front
        newItem = items[index];
        items.splice(index, 1);
      } else if (items.length >= 10) {
        // Remove the last item if the list is full
        items.pop();
      }
      return [newItem, ...items];
    });
  }

  function remove(item: RepositoryOption) {
    items.update((items) => {
      const index = items.findIndex((i) => i.url === item.url);
      if (index !== -1) {
        items.splice(index, 1);
      }
      return items;
    });
  }

  async function fetchData() {
    const data = await responseWithErrorHandeling<RepositoryOption[]>(
      customFetch('/user/recent-projects', {
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      [],
      'Failed to fetch recent repositories'
    );
    items.set(data);
  }

  return {
    subscribe: items.subscribe,
    set: items.set,
    add,
    remove,
    fetchData
  };
}

export const recentRepositories = createRecentRepositoriesStore();
