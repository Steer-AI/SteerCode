import {
  getAuthUIDHeader,
  getBackendUrl,
  getUIDHeader
} from '$lib/core/services/request';
import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
import {
  fetchEventSource,
  type EventSourceMessage
} from '@microsoft/fetch-event-source';
import { get } from 'svelte/store';

export async function fetchStream(
  path: string,
  options: {
    body: object;
    streamController?: AbortController;
    onOpen?: (res: Response) => void;
    onMessage: (event: EventSourceMessage) => void;
    onClose?: () => void;
    onError?: (err: any) => void;
  }
) {
  const { body, streamController, onOpen, onMessage, onClose, onError } =
    options;

  const settings = get(settingsStore);

  // Prepare the request options
  const headers: Record<string, string> = {};
  headers['Content-Type'] = 'application/json';
  headers['X-UID'] = getUIDHeader();
  headers['X-AUTH-UID'] = getAuthUIDHeader();
  headers['Accept'] = 'text/event-stream';

  // update header options
  const vst = window.localStorage.getItem('X_VECTOR_STORE_TYPE');
  if (vst) {
    headers['x-vector-store-type'] = vst;
  }
  if (settings.openaiAPIKey) {
    headers['x-openai-api-key'] = settings.openaiAPIKey;
  }
  const llm = window.localStorage.getItem('X_LLM_TYPE');
  if (llm) {
    headers['x-llm-type'] = llm;
  }

  async function stream(url: string, body: any) {
    await fetchEventSource(url, {
      openWhenHidden: true,
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
      async onopen(res) {
        onOpen && onOpen(res);
      },
      onmessage(event) {
        onMessage(event);
      },
      onclose() {
        onClose && onClose();
      },
      onerror(err) {
        onError && onError(err);
      },
      signal: streamController?.signal
    });
  }

  // Initialize the event stream with the URL and the data you want to post
  try {
    await stream(getBackendUrl() + path, body);
  } catch {
    // Do nothing
  }
}
