import type { IMergeMarkersDiff } from './types';

class MergeMarkersDiff implements IMergeMarkersDiff {
  head: string;
  incoming: string;
  fileName: string;
  branch?: string;

  constructor(
    head: string,
    incoming: string,
    fileName: string,
    branch?: string
  ) {
    this.head = head;
    this.incoming = incoming;
    this.fileName = fileName;
    this.branch = branch;
  }

  toMergeFormat(): string {
    return (
      '\n' +
      '<<<<<<< HEAD' +
      '\n' +
      this.head +
      '\n' +
      '=======' +
      '\n' +
      this.incoming +
      '\n' +
      '>>>>>>> ' +
      this.branch
    );
  }
}

const parseHead = (diff: string): string => {
  const startMarker = /<<<<<<< HEAD:(.*)\n/;
  const endMarker = /=======/;

  const startMatch = diff.match(startMarker);
  const endMatch = diff.match(endMarker);

  if (startMatch && endMatch) {
    const startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    const endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex);
  }

  return '';
};

const parseIncoming = (diff: string): string => {
  const startMarker = /=======\n/;
  const endMarker = />>>>>>> (.*)/;

  const startMatch = diff.match(startMarker);
  const endMatch = diff.match(endMarker);

  if (startMatch && endMatch) {
    const startIndex = diff.indexOf(startMatch[0]) + startMatch[0].length;
    const endIndex = diff.indexOf(endMatch[0]);
    return diff.substring(startIndex, endIndex);
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

  return new MergeMarkersDiff(
    head,
    incoming,
    fileName,
    branch
  ) as IMergeMarkersDiff;
};

export const parse = (diff: string): IMergeMarkersDiff[] => {
  const diffPattern =
    /<<<<<<< HEAD(.*?)?\n[\s\S]*?=======\n[\s\S]*?>>>>>>> .*?/g;

  const matches = [...diff.matchAll(diffPattern)];

  const changes: IMergeMarkersDiff[] = [];

  for (const match of matches) {
    const change = parseChange(match[0]);
    changes.push(change);
  }

  return changes;
};
