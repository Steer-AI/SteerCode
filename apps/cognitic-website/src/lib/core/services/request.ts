import { BACKEND_URL } from '$lib/shared/utils/constants';
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

export async function customFetch(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<Response> {
  const _options: RequestInit = {
    ...(options || {}),
    headers: {
      ...options?.headers,
      'X-UID': window.localStorage.getItem('cognitic.uid') || 'TEST'
    }
  };
  return fetch(BACKEND_URL + url, _options);
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
