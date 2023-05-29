import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
import { USER_COOKIE_ANONYMOUS_ID_NAME } from '$lib/shared/utils/constants';
import * as Sentry from '@sentry/browser';
import { Log } from './logging';

const returnFallbackAndLog = <T>(
  result: T,
  msg: string,
  ...args: unknown[]
) => {
  Log.ERROR(msg, ...args);
  return result;
};

export function getUIDHeader(): string {
  return localStorage.getItem(USER_COOKIE_ANONYMOUS_ID_NAME) || '';
}

export function getBackendUrl(version: string = 'v2'): string {
  const sv = settingsStore.getValue();
  if (sv.customBackendUrl && sv.useCustomBackend) {
    return sv.customBackendUrl + '/api/' + version;
  }
  return 'https://api.steercode.com' + '/api/' + version;
}

export async function customFetch(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<Response> {
  const _options: RequestInit = {
    ...(options || {}),
    headers: {
      ...options?.headers,
      'X-UID': getUIDHeader()
    }
  };
  return fetch(getBackendUrl() + url, _options);
}

export function requestWithRetries(
  url: string,
  options: RequestInit,
  retries = 1,
  fetchFn: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response> = customFetch
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const retry = (n: number) => {
      fetchFn(url, options)
        .then((resp) => {
          if (resp.ok) {
            resolve(resp);
          } else {
            if (n > 0) {
              retry(n - 1);
            } else {
              reject(resp);
            }
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            reject(err);
            return;
          }
          if (n > 0) {
            retry(n - 1);
          } else {
            reject(err);
          }
        });
    };
    retry(retries);
  });
}

// generic fetch function with abort controller and retries
// request is aborted if new request with same url is made
const abortControllers: Record<string, AbortController> = {};
export function requestWithAbortController(
  url: string,
  options: RequestInit,
  retries = 0,
  fetchFn: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response> = customFetch
): Promise<Response> {
  const _acUrl = url.split('?')[0];
  if (abortControllers[_acUrl]) {
    abortControllers[_acUrl].abort();
  }
  abortControllers[_acUrl] = new AbortController();
  const init = { ...options, signal: abortControllers[_acUrl].signal };
  return requestWithRetries(url, init, retries, fetchFn);
}

type BackednResponse<T> = {
  data: T | null;
  error: { code: number; message: string } | null;
};

export async function responseWithErrorHandeling<T>(
  request: Promise<Response>,
  fallback: T,
  errorMgs?: string
): Promise<T> {
  let resp: Response | null = null;

  try {
    resp = await request;
  } catch (err) {
    return returnFallbackAndLog<T>(
      fallback,
      errorMgs || 'Failed to fetch data',
      err
    );
  }

  if (!resp.ok) {
    return returnFallbackAndLog<T>(
      fallback,
      errorMgs || 'Failed to fetch data',
      resp.statusText,
      resp.status
    );
  }

  try {
    const res = (await resp.json()) as BackednResponse<T>;

    if (res.error || !res.data) {
      return returnFallbackAndLog<T>(
        fallback,
        res.error?.message || 'Failed to fetch data'
      );
    }
    return res.data;
  } catch (err) {
    Sentry.captureException(err);
    return returnFallbackAndLog<T>(
      fallback,
      errorMgs || 'Failed to parse data',
      resp.statusText,
      resp.status
    );
  }
}
