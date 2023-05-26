import { customFetch } from '$lib/core/services/request';
import type { RepositoryOption } from '$lib/models/types/conversation.type';
import { writable } from 'svelte/store';

function createRecentRepositoriesStore() {
  const items = writable<RepositoryOption[]>([]);

  function add(item: RepositoryOption) {
    items.update((items) => {
      const index = items.findIndex((i) => i.url === item.url);
      if (index !== -1) {
        // Item already exists, move it to the front
        items.splice(index, 1);
      } else if (items.length >= 10) {
        // Remove the last item if the list is full
        items.pop();
      }
      return [item, ...items];
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

  function fetchData() {
   customFetch('/chat/recent-projects', {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(
      resp => resp.json()
    ).then(
      data => items.set(data['data'] as RepositoryOption[])
    );
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
