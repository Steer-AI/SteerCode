import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

function createFilteredFilesStore() {
  const _filteredFiles = writable<IFileTreeItem | null>(null);

  function filterChildren(
    fileTree: IFileTreeItem,
    query: string
  ): IFileTreeItem {
    const filteredChildren: IFileTreeItem[] = [];

    for (const child of fileTree.children) {
      if (child.isDirectory) {
        const filteredChild = filterChildren(child, query);
        if (filteredChild.children.length > 0) {
          filteredChildren.push(filteredChild);
        }
      } else if (child.fileName.toLowerCase().includes(query.toLowerCase())) {
        filteredChildren.push(child);
      }
    }

    return {
      fileName: fileTree.fileName,
      filePath: fileTree.filePath,
      children: filteredChildren,
      isDirectory: fileTree.isDirectory
    };
  }

  function search(query: string | null, fileTree: IFileTreeItem | null) {
    if (!fileTree) {
      _filteredFiles.set(null);
      return;
    }

    console.log('searching for', query);

    if (!query) {
      console.log('no query');
      _filteredFiles.set(null);
      return;
    }

    const searchResult = filterChildren(fileTree, query);

    console.log('search results', searchResult);
    _filteredFiles.set(searchResult);
  }

  return {
    subscribe: _filteredFiles.subscribe,
    search
  };
}

export const filteredFiles = createFilteredFilesStore();
