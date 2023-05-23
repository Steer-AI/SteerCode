import { SENTRY_HOST, SENTRY_PROJECT_ID } from '$env/static/private';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async function POST({ request }) {
  try {
    const envelope = await request.text();
    const pieces = envelope.split('\n');
    const header = JSON.parse(pieces[0]);
    // DSNs are of the form `https://<key>@o<orgId>.ingest.sentry.io/<projectId>`
    const { host, pathname } = new URL(header.dsn);
    // Remove leading slash
    const projectId = pathname.substring(1);

    if (host !== SENTRY_HOST) {
      throw new Error(`invalid host: ${host}`);
    }

    if (projectId !== SENTRY_PROJECT_ID) {
      throw new Error(`invalid project id: ${projectId}`);
    }

    const sentryIngestURL = `https://${host}/api/${projectId}/envelope/`;
    return await fetch(sentryIngestURL, {
      method: 'POST',
      body: envelope
    });
  } catch (e) {
    console.error('tunnel error', e);
    throw error(400, 'invalid request');
  }
};
