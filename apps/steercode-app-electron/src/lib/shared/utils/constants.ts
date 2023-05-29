export const DEBUG_MODE =
  (typeof window !== 'undefined' && localStorage.getItem('DEBUG') === 'true') ||
  false;

export const USER_COOKIE_ANONYMOUS_ID_NAME = 'cognitic.auid';
