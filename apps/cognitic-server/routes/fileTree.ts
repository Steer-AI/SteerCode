import {
  IErrorResponse,
  IFileTreeItem,
  IFileTreeReqParams,
  IFileTreeResponse
} from 'cognitic-models';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const getDirectoryContent = (
  dirPath: string,
  maxDepth: number
): IFileTreeItem[] => {
  let result: IFileTreeItem[] = [];

  if (maxDepth <= 0) return result;

  fs.readdirSync(dirPath).forEach((file) => {
    const absolutePath = path.join(dirPath, file);
    const stat = fs.lstatSync(absolutePath);

    let item: IFileTreeItem = {
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

router.get(
  '/fileTree',
  (
    req: Request<{}, {}, {}, IFileTreeReqParams>,
    res: Response<IFileTreeResponse | IErrorResponse, {}>
  ) => {
    const { path, maxDepth } = req.query;

    // Check if dirPath is a directory
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
      try {
        const content = getDirectoryContent(path, maxDepth || 1);
        const resp = {
          success: true,
          path: path,
          content: content
        };
        res.json(resp);
      } catch (error) {
        res
          .status(500)
          .json({
            success: false,
            message: 'Error reading directory content.'
          } as IErrorResponse);
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Invalid directory path.' });
    }
  }
);

export default router;
