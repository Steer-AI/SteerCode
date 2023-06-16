import { fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source';
import { get } from 'svelte/store';
import {
    getAuthUIDHeader,
    getBackendUrl,
    getUIDHeader
  } from '$lib/core/services/request';
import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';
import type { IFileContentItem, IFileTreeItem } from 'cognitic-models';
import {
    initialFileTreeFile  } from '$lib/shared/stores/selectedRepository';
import { settingsStore } from '$lib/features/SettingsModal/stores/settings';
import type { ChatMode, ConversationDTO } from '$lib/models/types/conversation.type';


export async function fetchStream(
    conversation: ConversationDTO, 
    path: string,
    documents: any[], 
    techStackValue: string, 
    chatModeValue: ChatMode, 
    initialFileTree: IFileTreeItem | null,
    streamController: AbortController, 

    onOpen: (res: Response) => void,
    onMessage: (event: EventSourceMessage) => void, 
    onClose: () => void, 
    onError: (err: any) => void) {

    const settings = get(settingsStore);
    const signal = streamController.signal;

    // Prepare the request options
    const headers: Record<string, string> = {};
    headers['Content-Type'] = 'application/json';
    headers['X-UID'] = getUIDHeader();
    headers['X-AUTH-UID'] = getAuthUIDHeader();
    headers['Accept'] = 'text/event-stream';

    console.log(getAuthUIDHeader());
    console.log(getUIDHeader());

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


    const body = {
      ...conversation,
      documents: documents,
      root_directory: initialFileTree,
      technology_description: techStackValue,
      chat_mode: chatModeValue
    };

    async function stream(url: string, body: any) {
      await fetchEventSource(url, {
        openWhenHidden: true,
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
        async onopen(res) {
            onOpen(res);
        },
        onmessage(event) {
          onMessage(event);
        },
        onclose() {
          onClose();
        },
        onerror(err) {
          onError(err);
        },
        signal: signal
      });
    }

    // Initialize the event stream with the URL and the data you want to post
    try {
      await stream(getBackendUrl() + path, body);
    } catch {
      // Do nothing
    }
  }