export const DEBUG_MODE =
  (typeof window !== 'undefined' && localStorage.getItem('DEBUG') === 'true') ||
  false;

export const BACKEND_CHAT_URL =
  (typeof window !== 'undefined' && localStorage.getItem('BACKEND_CHAT_URL')) ||
  '/api/chat';
