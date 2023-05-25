import {
  IFileContentItem,
} from 'cognitic-models';
const fs = require('fs');
const path = require('path');


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

const loadFileContent = async (filePath: string): Promise<IFileContentItem> => {
  try {
    const content = await fs.readFileSync(filePath, { encoding: 'utf8' });
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: content
    };
  } catch (error: any) {
    throw new LoadFileError(error?.message, filePath);
  }
};

export const getContentsForFiles = async (paths: string[]) => {
  const promises = paths.map(loadFileContent);
  const contents = await Promise.allSettled(promises);

  const files: IFileContentItem[] = [];

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

