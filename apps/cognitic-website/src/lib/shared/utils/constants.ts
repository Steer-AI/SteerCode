export const DEBUG_MODE =
  (typeof window !== 'undefined' &&
    window.localStorage?.getItem('DEBUG') === 'true') ||
  false;

export const AGENT_MODE =
  (typeof window !== 'undefined' &&
    window.localStorage?.getItem('AGENT_MODE') === 'true') ||
  false;


  export const BACKEND_CHAT_URL = (typeof window !== 'undefined' &&
    window.localStorage?.getItem('BACKEND_CHAT_URL')) || '/api/chat';