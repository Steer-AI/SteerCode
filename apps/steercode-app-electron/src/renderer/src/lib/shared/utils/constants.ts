export const DEBUG_MODE =
  (typeof window !== 'undefined' && localStorage.getItem('DEBUG') === 'true') ||
  false;

export const USER_COOKIE_ID_NAME = 'cognitic.uid';
export const USER_COOKIE_ANONYMOUS_ID_NAME = 'cognitic.auid';
export const AUTH_URL =
  'https://auth.getsteer.ai/sign_in?protocol=steercode&redirect=auth';
