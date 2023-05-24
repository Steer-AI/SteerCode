import type { IFileContentItem, IFileTreeItem } from 'cognitic-models';

import { Log } from '$lib/core/services/logging';
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';

class LoadFileError extends Error {
  filePath: string;

  constructor(message: string, filePath: string) {
    super(message);
    this.message = message;
    this.filePath = filePath;
    this.name = 'LoadFileError';
    this.stack = new Error().stack;
  }
}

// File tree functionality
// -----------------------------------
const getDirectoryContent = (
  dirPath: string,
  maxDepth: number
): IFileTreeItem[] => {
  const result: IFileTreeItem[] = [];

  if (maxDepth <= 0) return result;

  fs.readdirSync(dirPath).forEach((file) => {
    const absolutePath = path.join(dirPath, file);
    const stat = fs.lstatSync(absolutePath);

    const item: IFileTreeItem = {
      fileName: file,
      filePath: absolutePath,
      children: [],
      isDirectory: stat.isDirectory()
    };

    if (stat.isDirectory()) {
      item.children = getDirectoryContent(absolutePath, maxDepth - 1);
    }

    result.push(item);
  });

  return result;
};

export function getFileTree(path: string, maxDepth?: number): IFileTreeItem[] {
  // Check if dirPath is a directory
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    return getDirectoryContent(path, maxDepth || 1);
  } else {
    throw new Error(`Invalid directory path: ${path}`);
  }
}

// File content functionality
// -----------------------------------
const loadFileContent = async (filePath: string): Promise<IFileContentItem> => {
  try {
    const content = await fsAsync.readFile(filePath, { encoding: 'utf8' });
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: content
    };
  } catch (error: any) {
    throw new LoadFileError(error?.message, filePath);
  }
};

export async function getContentsForFiles(
  paths: string[]
): Promise<IFileContentItem[]> {
  const promises = paths.map(loadFileContent);
  const contents = await Promise.allSettled(promises);

  const files: IFileContentItem[] = [];
  const errors: LoadFileError[] = [];

  contents.forEach((content) => {
    if (content.status === 'fulfilled') {
      files.push(content.value);
    } else {
      Log.WARNING(
        `There was an error loading content for file: ${content.reason}`
      );
    }
  });

  return files;
}
