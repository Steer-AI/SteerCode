import { browser } from '$app/environment';
import { auth } from '$lib/core/services/firebase';
import { Log } from '$lib/core/services/logging';
import { resetAnalytics, trackIdentify } from '$lib/core/services/tracking';
import type { User, UserSubscription } from '$lib/models/types/user.type';
import * as Sentry from '@sentry/svelte';
import { onAuthStateChanged } from 'firebase/auth';
import { get, writable } from 'svelte/store';
import {
  USER_COOKIE_ANONYMOUS_ID_NAME,
  USER_COOKIE_ID_NAME
} from '../utils/constants';

import {
  customFetch,
  responseWithErrorHandeling
} from '$lib/core/services/request';

export function getOrCreateAnonymousUID(): string {
  let auid = localStorage.getItem(USER_COOKIE_ANONYMOUS_ID_NAME);
  if (!auid) {
    auid = window.electron.getUid() as string;
    localStorage.setItem(USER_COOKIE_ANONYMOUS_ID_NAME, auid);
  }
  return auid;
}

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

  async function fetchUserSubscription(uid: string) {
    Log.DEBUG('fetchUserSubscription', uid);
    const userInfo = await responseWithErrorHandeling<UserSubscription>(
      customFetch(`/user/subscription/${uid}`),
      {
        uid,
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
      refetchSubscription(user);
    } else {
      resetAnalytics();
      Sentry.setUser(null);
      window.localStorage.removeItem(USER_COOKIE_ID_NAME);
      window.localStorage.removeItem('cognitic.user');
      _user.set(null);
    }
  });

  function isPremium(user: User | null): boolean {
    if (!user) return false;
    return Boolean(
      user.stripe &&
        user.stripe.subscribed_until !== null &&
        Date.now() < new Date(user.stripe.subscribed_until).getTime()
    );
  }

  function refetchSubscription(user?: User) {
    const _u = user || get(_user);
    if (!_u) return;

    fetchUserSubscription(_u.uid).then((_ui) => {
      if (!_u) return;

      const tmp: User = {
        email: _u.email,
        displayName: _u.displayName,
        photoURL: _u.photoURL,
        ..._ui
      };

      window.localStorage.setItem('cognitic.user', JSON.stringify(tmp));
      _user.set(tmp);
    });
  }

  return {
    subscribe: _user.subscribe,
    refetchSubscription,
    isPremium
  };
}

export const user = createUserStore();
