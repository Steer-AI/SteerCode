import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

function createFilteredFilesStore() {
  const _filteredFiles = writable<IFileTreeItem | null>(null);

  function expandRecursively(fileTree: IFileTreeItem) {
    if (fileTree.isDirectory) {
      fileTree.expanded = true;
      for (const child of fileTree.children) {
        expandRecursively(child);
      }
    }
  }

  function filterChildren(
    fileTree: IFileTreeItem,
    query: string
  ): IFileTreeItem {
    const filteredChildren: IFileTreeItem[] = [];

    if (
      fileTree.filePath.toLowerCase().includes(query.toLowerCase()) &&
      fileTree.isDirectory
    ) {
      // expand all children
      expandRecursively(fileTree);

      filteredChildren.push(...fileTree.children);
    } else {
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
    }

    return {
      fileName: fileTree.fileName,
      filePath: fileTree.filePath,
      children: filteredChildren,
      isDirectory: fileTree.isDirectory,
      expanded: true
    };
  }

  function search(query: string | null, fileTree: IFileTreeItem | null) {
    if (!fileTree) {
      _filteredFiles.set(null);
      return;
    }

    if (!query) {
      _filteredFiles.set(null);
      return;
    }

    const searchResult = filterChildren(fileTree, query);
    _filteredFiles.set(searchResult);
  }

  return {
    subscribe: _filteredFiles.subscribe,
    search
  };
}

export const filteredFiles = createFilteredFilesStore();
