const fs = require('fs');
const fsAsync = fs.promises;
const path = require('path');

class LoadFileError extends Error {
  constructor(message, filePath) {
    super(message);
    this.message = message;
    this.filePath = filePath;
    this.name = 'LoadFileError';
    this.stack = new Error().stack;
  }
}

// File tree functionality
// -----------------------------------
const getDirectoryContent = (dirPath, maxDepth) => {
  const result = [];

  if (maxDepth <= 0) return result;

  fs.readdirSync(dirPath).forEach((file) => {
    const absolutePath = path.join(dirPath, file);
    const stat = fs.lstatSync(absolutePath);

    const item = {
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

function getFileTree(path, maxDepth) {
  // Check if dirPath is a directory
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    return getDirectoryContent(path, maxDepth || 1);
  } else {
    throw new Error(`Invalid directory path: ${path}`);
  }
}

// File content functionality
// -----------------------------------
const loadFileContent = async (filePath) => {
  try {
    const content = await fsAsync.readFile(filePath, { encoding: 'utf8' });
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: content
    };
  } catch (error) {
    throw new LoadFileError(error?.message, filePath);
  }
};

async function getContentsForFiles(paths) {
  const promises = paths.map(loadFileContent);
  const contents = await Promise.allSettled(promises);

  const files = [];
  const errors = [];

  contents.forEach((content) => {
    if (content.status === 'fulfilled') {
      files.push(content.value);
    } else {
      console.warn(
        `There was an error loading content for file: ${content.reason}`
      );
    }
  });

  return files;
}

module.exports = { getFileTree, getContentsForFiles };
