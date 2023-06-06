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

  function isPremium(user: User | null): boolean {
    if (!user) return false;
    return (
      user.stripe !== null &&
      user.stripe.subscribed_until !== null &&
      Date.now() < new Date(user.stripe.subscribed_until).getTime()
    );
  }

  return {
    subscribe: user.subscribe,
    fetchUserInfo,
    isPremium
  };
}

export const user = createUserStore();
