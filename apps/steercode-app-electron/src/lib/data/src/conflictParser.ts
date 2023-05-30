const parseHead = (diff: string): string => {
  const startMarker = /<<<<<<< HEAD:(.*)/;
  const endMarker = /=======/;

  const startMatch = diff.match(startMarker);
  const endMatch = diff.match(endMarker);

  if (startMatch && endMatch) {
    const startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    const endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex).trim();
  }

  return '';
};

const parseIncoming = (diff: string): string => {
  const startMarker = /=======/;
  const endMarker = />>>>>>> (.*)/;

  const startMatch = diff.match(startMarker);
  const endMatch = diff.match(endMarker);

  if (startMatch && endMatch) {
    const startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    const endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex).trim();
  }

  return '';
};

const parseFileName = (diff: string): string => {
  const fileNamePattern = /<<<<<<< HEAD:(.*)/;

  const fileNameMatch = diff.match(fileNamePattern);

  if (fileNameMatch) {
    return fileNameMatch[1].trim();
  }

  return '';
};

const parseBranchName = (diff: string): string => {
  const branchPattern = />>>>>>> (.*)/;

  const branchMatch = diff.match(branchPattern);

  if (branchMatch) {
    return branchMatch[1].trim();
  }

  return '';
};

const parseChange = (diff: string) => {
  const head = parseHead(diff);
  const incoming = parseIncoming(diff);
  const fileName = parseFileName(diff);
  const branch = parseBranchName(diff);

  return {
    head: head,
    incoming: incoming,
    fileName: fileName,
    branch: branch
  } as IMergeMarkersDiff;
};

export const parse = (diff: string): IMergeMarkersDiff[] => {
  const diffPattern = /<<<<<<< HEAD:(.*)[\s\S]*?>>>>>>> (.*)/g;

  const matches = diff.matchAll(diffPattern);

  const changes = [];

  for (const match of matches) {
    const change = parseChange(match[0]);
    changes.push(change);
  }

  return changes;
};
