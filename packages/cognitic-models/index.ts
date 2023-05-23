export type Foo = string;

export interface ISuccessResponse {
  success: boolean;
}

export interface IErrorResponse extends ISuccessResponse {
  success: false;
  message: string;
}

export interface IFileTreeResponse extends ISuccessResponse {
  content: IFileTreeItem[];
  path: string;
}

export interface IFileTreeReqParams {
  path: string;
  maxDepth?: number;
}

export interface IFileTreeItem {
  fileName: string;
  filePath: string;
  isDirectory: boolean;
  children: IFileTreeItem[];
}
