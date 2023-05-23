import {
  IErrorResponse,
  IFileContentItem,
  IFileContentReqParams,
  IFilesContentResponse
} from 'cognitic-models';
import { Request, Response, Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

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
    const content = await fs.readFile(filePath, { encoding: 'utf8' });
    return {
      filePath: filePath,
      fileName: path.basename(filePath),
      fileContent: content
    };
  } catch (error: any) {
    throw new LoadFileError(error?.message, filePath);
  }
};

router.post(
  '/fileContent',
  async (
    req: Request<any, any, IFileContentReqParams, any>,
    res: Response<IFilesContentResponse | IErrorResponse, any>
  ) => {
    const { paths } = req.body;

    const promises = paths.map(loadFileContent);
    const contents = await Promise.allSettled(promises);

    const files: IFileContentItem[] = [];
    const errors: LoadFileError[] = [];

    contents.forEach((content) => {
      if (content.status === 'fulfilled') {
        files.push(content.value);
      } else {
        errors.push(content.reason);
      }
    });
    if (files.length) {
      res.status(200).json({
        success: true,
        files: files
      } as IFilesContentResponse);
    } else {
      res.status(500).json({
        success: false,
        message: JSON.stringify(errors)
      } as IErrorResponse);
    }
  }
);

export default router;
