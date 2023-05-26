import { IFileTreeItem } from 'cognitic-models';
import ignore from 'ignore';
const fs = require('fs');
const path = require('path');

const isRelevantFile = (file: string): boolean => {
  if (file === '.git' || file === '.idea') return false;

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

    // Check for .gitignore files at multiple levels
    const gitignoreFiles: string[] = [];
    let currentPath = dirPath;
    while (currentPath !== path.dirname(currentPath)) {
      const gitignorePath = path.join(currentPath, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        gitignoreFiles.push(gitignorePath);
      }
      currentPath = path.dirname(currentPath);
    }

    // Parse .gitignore files and check if the current file should be ignored
    const ig = ignore();
    gitignoreFiles.forEach((gitignorePath) => {
      const gitignoreContent = fs.readFileSync(gitignorePath).toString();
      ig.add(gitignoreContent);
    });

    const relativePath = path.relative(dirPath, absolutePath);
    if (ig.ignores(relativePath)) {
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
