import { IFileTreeItem } from 'cognitic-models';
import fs from 'fs';
import path from 'path';

const isRelevantFile = (file: string): boolean => {
  if (
    file.startsWith('.') ||
    file === 'node_modules' ||
    file === '.git' ||
    file === '.idea'
  )
    return false;

  if (file === '__pycache__' || file === '.DS_Store' || file === '__MACOSX')
    return false;

  // Additional files and folders to ignore
  if (
    file === '.vscode' ||
    file === '.svn' ||
    file === '.hg' ||
    file === '.settings' ||
    file.match(/.*\.log$/) ||
    file.match(/.*\.tmp$/) ||
    file.match(/.*\.bak$/) ||
    file.match(/.*~$/)
  )
    return false;

  return true;
};

const getDirectoryContent = (
  dirPath: string,
  maxDepth: number
): IFileTreeItem[] => {
  const result: IFileTreeItem[] = [];

  if (maxDepth <= 0) return result;

  fs.readdirSync(dirPath).forEach((file) => {
    const absolutePath = path.join(dirPath, file);
    const stat = fs.lstatSync(absolutePath);

    if (!isRelevantFile(file)) {
      return;
    }
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

export const getFileTree = (path: string, maxDepth: number) => {
  const usedDepht = maxDepth === -1 ? 100 : maxDepth;

  // Check if dirPath is a directory
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    return getDirectoryContent(path, usedDepht || 1);
  } else {
    throw new Error(`Invalid directory path: ${path}`);
  }
};
