import { browser } from '$app/environment';
import { auth } from '$lib/core/services/firebase';
import { Log } from '$lib/core/services/logging';
import { resetAnalytics, trackIdentify } from '$lib/core/services/tracking';
import type { User } from '$lib/models/types/user.type';
import * as Sentry from '@sentry/svelte';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { readable } from 'svelte/store';
import { USER_COOKIE_ID_NAME } from '../utils/constants';

function getUserFromLocalStorage(): User | null {
  if (!browser) return null;

  const user = window.localStorage.getItem('cognitic.user');
  if (user) {
    return JSON.parse(user);
  }

  return null;
}

export const user = readable<User | null>(getUserFromLocalStorage(), (set) => {
  if (!browser) return;

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

      const _user: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      Cookies.set(USER_COOKIE_ID_NAME, user.uid);
      window.localStorage.setItem('cognitic.user', JSON.stringify(_user));
      set(_user);
    } else {
      resetAnalytics();
      Sentry.setUser(null);
      Cookies.remove(USER_COOKIE_ID_NAME);
      window.localStorage.removeItem('cognitic.user');
      set(null);
    }
  });
});
