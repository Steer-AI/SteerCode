import { PUBLIC_BACKEND_API_URL } from '$env/static/public';

export const DEBUG_MODE =
  (typeof window !== 'undefined' && localStorage.getItem('DEBUG') === 'true') ||
  false;

export const BACKEND_URL =
  (typeof window !== 'undefined' && localStorage.getItem('BACKEND_API_URL')) ||
  PUBLIC_BACKEND_API_URL;
