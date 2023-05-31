import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

function createSelectedEntitiesStore() {
  const _selection = writable<IFileTreeItem[]>([]);

  function add(item: IFileTreeItem) {
    _selection.update((selection) => {
      if (selection.find((s) => s.filePath === item.filePath)) {
        return selection;
      }
      return [...selection, item];
    });
  }

  function remove(item: IFileTreeItem) {
    _selection.update((selection) => {
      return selection.filter((s) => s.filePath !== item.filePath);
    });
  }

  function clear() {
    _selection.set([]);
  }

  return {
    subscribe: _selection.subscribe,
    add,
    remove,
    clear
  };
}

export const selectedEntities = createSelectedEntitiesStore();
