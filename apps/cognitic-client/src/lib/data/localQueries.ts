import type {
  IErrorResponse,
  IFileContentItem,
  IFileContentReqParams,
  IFileTreeResponse
} from 'cognitic-models';

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

export function fetchFilesContent(
  paths: string[]
): Promise<IFileContentItem | IErrorResponse> {
  const payload = paths.reduce(
    (cur, path) => ({ paths: [...cur.paths, path] }),
    { paths: [] } as IFileContentReqParams
  );
  return fetch('/api/fileContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .catch((err) => {
      const resp: IErrorResponse = {
        success: false,
        message: err.message
      };
      return resp;
    });
}
