import { browser } from '$app/environment';
import { auth } from '$lib/core/services/firebase';
import { Log } from '$lib/core/services/logging';
import { resetAnalytics, trackIdentify } from '$lib/core/services/tracking';
import type { User, UserInfo } from '$lib/models/types/user.type';
import * as Sentry from '@sentry/svelte';
import { onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';
import { USER_COOKIE_ID_NAME } from '../utils/constants';

import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';

function getUserFromLocalStorage(): User | null {
  if (!browser) return null;

  const user = window.localStorage.getItem('cognitic.user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

function createUserStore() {
  const _user = writable<User | null>(getUserFromLocalStorage());

  async function fetchUserInfo(uid: string) {
    Log.DEBUG('fetchUserInfo', uid);
    const userInfo = await responseWithErrorHandeling<UserInfo>(
      customFetch(`/user`),
      {
        id: uid,
        projects: [],
        stripe: null
      }
    );
    return userInfo;
  }

  onAuthStateChanged(auth, (user) => {
    Log.DEBUG('user', user);
    if (user) {
      trackIdentify(user.uid, {
        email: user.email,
        username: user.displayName,
        avatar: user.photoURL
      });
      Sentry.setUser({
        id: user.uid,
        email: user.email || undefined,
        username: user.displayName || undefined
      });
      window.localStorage.setItem(USER_COOKIE_ID_NAME, user.uid);

      fetchUserInfo(user.uid).then((_ui) => {
        const _u: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ..._ui
        };
        window.localStorage.setItem('cognitic.user', JSON.stringify(_u));
        _user.set(_u);
      });
    } else {
      resetAnalytics();
      Sentry.setUser(null);
      window.localStorage.removeItem(USER_COOKIE_ID_NAME);
      window.localStorage.removeItem('cognitic.user');
      _user.set(null);
    }
  });

  function isPremium(user: UserInfo | null): boolean {
    if (!user) return false;
    return (
      user.stripe !== null &&
      user.stripe.subscribed_until !== null &&
      Date.now() < new Date(user.stripe.subscribed_until).getTime()
    );
  }

  return {
    subscribe: _user.subscribe,
    fetchUserInfo,
    isPremium
  };
}

export const user = createUserStore();
