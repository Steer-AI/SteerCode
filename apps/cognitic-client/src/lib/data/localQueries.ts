import type { IErrorResponse, IFileTreeResponse } from 'cognitic-models';

export function fetchFileTree(
  path: string,
  maxDepth?: number
): Promise<IFileTreeResponse | IErrorResponse> {
  return fetch(`/api/fileTree?path=${path}&maxDepth=${maxDepth || 1}`)
    .then((res) => res.json())
    .catch((err) => {
      const resp: IErrorResponse = {
        success: false,
        message: err.message
      };
      return resp;
    });
}
