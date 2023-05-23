import { writable,type Updater,type Writable } from 'svelte/store';


type WritableStoreWithValue<T> = Writable<T> & { getValue: () => T };

const CACHE: Map<string, WritableStoreWithValue<any>> = new Map();

interface Serializer<T> {
  parse(text: string): T;
  stringify(object: T): string;
}

interface Options<T> {
  serializer?: Serializer<T>;
  storage?: Storage;
}

export function localStorageWritable<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
): WritableStoreWithValue<T> {
  const browser = typeof window !== 'undefined' && typeof document !== 'undefined';

  function getStorage(): Storage {
    if (browser) {
      return options?.storage ?? localStorage;
    } else {
      throw new Error('No storage available');
    }
  }
  const serializer = options?.serializer ?? JSON;

  function createPersistedWritable() {
    const initialPersistedValue = browser ? getStorage().getItem(key) : null;
    let currentValue =
      initialPersistedValue !== null
        ? (serializer.parse(initialPersistedValue) as T)
        : initialValue;
    const store = writable<T>(currentValue);
    browser && getStorage().setItem(key, serializer.stringify(currentValue));
    
    const persistedStore = {
      set(value: T) {
        currentValue = value;
        browser &&
          getStorage().setItem(key, serializer.stringify(currentValue));
        store.set(currentValue);
      },
      update(updater: Updater<T>) {
        currentValue = updater(currentValue);
        browser && getStorage().setItem(key, serializer.stringify(currentValue));
        store.set(currentValue);
      },
      subscribe: store.subscribe,
      getValue: () => currentValue
    };
    return persistedStore;
  }

  return CACHE.get(key) || createPersistedWritable();
}
