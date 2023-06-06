import { customFetch } from '$lib/core/services/request';
import type { RemoteConfig } from '$lib/models/types/settings.type';
import { writable } from 'svelte/store';

function createRemoteConfigStore() {
  const _remoteConfig = writable<RemoteConfig>();

  function fetchData() {
    customFetch('/configuration/remote-config', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((resp) => resp.json())
      .then((data) => _remoteConfig.set(data['data'] as RemoteConfig));
  }

  return {
    subscribe: _remoteConfig.subscribe,
    fetchData
  };
}

export const remoteConfig = createRemoteConfigStore();
