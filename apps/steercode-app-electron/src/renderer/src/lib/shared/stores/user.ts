import type { User } from '$lib/models/types/user.type';
import { writable } from 'svelte/store';

import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';

function createUserStore() {
  const user = writable<User | null>(null);

  async function fetchUserInfo(uid: string) {
    const response = customFetch(`/user/`);
    const userInfo = await responseWithErrorHandeling<User | null>(
      response,
      null
    );
    if (userInfo) {
      user.set(userInfo);
    }
  }

  return {
    subscribe: user.subscribe,
    set: user.set,
    fetchUserInfo
  };
}

export const user = createUserStore();
