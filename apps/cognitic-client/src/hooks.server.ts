import { VITE_PUBLIC_ENV } from '$env/static/private';
import { USER_COOKIE_ANONYMOUS_ID_NAME } from '$lib/shared/utils/constants';
import type { Handle } from '@sveltejs/kit';
import { machineIdSync } from 'node-machine-id';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    if (!event.cookies.get(USER_COOKIE_ANONYMOUS_ID_NAME)) {
      // if this is the first time the user has visited this app,
      // set a cookie so that we recognise them when they return
      event.cookies.set(USER_COOKIE_ANONYMOUS_ID_NAME, machineIdSync(true), {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        // only sent over HTTPS in production
        secure: VITE_PUBLIC_ENV === 'production',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year
      });
    }
  } catch (err) {
    console.error(err);
  }

  const response = await resolve(event);

  return response;
};
