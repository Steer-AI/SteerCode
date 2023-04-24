import { error, type RequestHandler } from '@sveltejs/kit';
import { ANALYTICS_CDN_URL } from '$env/static/private';

async function proxyFetch({
  method,
  url,
  body,
  headers
}: {
  method: string;
  url: string;
  body?: string;
  headers: Headers;
}) {
  try {
    const _url = ANALYTICS_CDN_URL + url;

    const _headers = new Headers(headers);
    _headers.delete('host');
    _headers.delete('connection');

    const _request = new Request(
      // BE don't need "_vercel_no_cache" param,
      // they have no-cache header in case
      _url.replace('&_vercel_no_cache=1', ''),
      {
        body,
        method,
        headers: _headers
      }
    );

    const resp = await fetch(_request);

    const ab = await resp.arrayBuffer();

    const resp2 = new Response(ab, {
      status: resp.status,
      statusText: resp.statusText,
      headers: new Headers({
        'content-type': resp.headers.get('content-type') || 'application/json',
        // 'content-encoding': encoddedAs,
        'cache-control':
          resp.headers.get('cache-control') ||
          'public, max-age=0, must-revalidate',
        'content-language': resp.headers.get('content-language') || 'en'
        // 'content-length': compressed.byteLength.toString(),
        // connection: 'closed'
      })
    });
    return resp2;
  } catch (err: unknown) {
    const message = `Error fetching ${url}: ${err as string}`;
    console.error(err);
    throw error(500, message as string);
  }
}

export const POST: RequestHandler = async function POST({ params, request }) {
  const url = params.path as string;
  const body = await request.json();
  return proxyFetch({
    url,
    method: 'POST',
    body: JSON.stringify(body),
    headers: request.headers
  });
};

export const GET: RequestHandler = async function GET({ params, request }) {
  const searchParams = new URL(request.url).search;

  const url = params.path + searchParams;

  return proxyFetch({
    url,
    method: 'GET',
    headers: request.headers
  });
};
