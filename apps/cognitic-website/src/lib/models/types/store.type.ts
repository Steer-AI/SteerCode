import type { Readable } from 'svelte/store';

export type DataStore<T = any, K = any> = {
  subscribe: Readable<T[]>['subscribe'];
  add: (item: K) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  getById: (id: string) => Readable<T | null>;
  fetchById: (id: string) => Promise<void>;
};
