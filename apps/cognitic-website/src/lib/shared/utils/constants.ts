export const DEBUG_MODE =
  (typeof window !== 'undefined' &&
    window.localStorage?.getItem('DEBUG') === 'true') ||
  false;
