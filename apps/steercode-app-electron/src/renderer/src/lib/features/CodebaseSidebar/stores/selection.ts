import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

function createSelectedEntitiesStore() {
  let _selectionV: IFileTreeItem[] = [];
  const _selection = writable<IFileTreeItem[]>(_selectionV);

  function add(item: IFileTreeItem | IFileTreeItem[]) {
    _selection.update((selection) => {
      if (Array.isArray(item)) {
        _selectionV = [
          ...selection,
          ...item.filter(
            (i) =>
              !i.isDirectory &&
              !selection.find((s) => s.filePath === i.filePath)
          )
        ];
      } else if (
        !item.isDirectory &&
        !selection.find((s) => s.filePath === item.filePath)
      ) {
        _selectionV = [...selection, item];
      } else {
        return selection;
      }
      return _selectionV;
    });
  }

  function remove(item: IFileTreeItem | IFileTreeItem[]) {
    _selection.update((selection) => {
      if (Array.isArray(item)) {
        _selectionV = selection.filter(
          (s) => !item.find((i) => i.filePath === s.filePath)
        );
      } else {
        _selectionV = selection.filter((s) => s.filePath !== item.filePath);
      }
      return _selectionV;
    });
  }

  function has(item: IFileTreeItem | IFileTreeItem[]) {
    if (Array.isArray(item)) {
      return item.every((i) =>
        Boolean(_selectionV.find((s) => s.filePath === i.filePath))
      );
    } else {
      return Boolean(_selectionV.find((s) => s.filePath === item.filePath));
    }
  }

  function clear() {
    _selectionV = [];
    _selection.set([]);
  }

  return {
    subscribe: _selection.subscribe,
    add,
    remove,
    clear,
    has
  };
}

export const selectedEntities = createSelectedEntitiesStore();
