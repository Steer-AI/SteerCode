import { parse } from 'diff2html'; // Update this to your actual imports
import type { DiffBlock, DiffFile } from 'diff2html/lib/types';
import { LineType } from 'diff2html/lib/types';
import * as fs from 'fs';

export const applyDiff = (diff: string) => {
  const change = parse(diff);

  for (const file of change) {
    applyFileDiff(file);
  }
};

export function applyFileDiff(diff: DiffFile) {
  const oldFilePath = diff.oldName;
  const newFilePath = diff.newName;

  // check if the file is new
  const isNew = oldFilePath === '/dev/null';
  // check if the file has been renamed
  const isRenamed = oldFilePath !== newFilePath && oldFilePath !== '/dev/null';
  // check if the file has been deleted
  const isDeleted = newFilePath === '/dev/null';

  if (isDeleted && deleteFile(oldFilePath)) {
    return; // No need to apply diff to a deleted file
  }

  if (isRenamed && !renameFile(oldFilePath, newFilePath)) {
    return;
  }

  let lines: string[] = [];
  if (!isNew) {
    // Read the current file
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(newFilePath, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${newFilePath}: ${err}`);
      return;
    }
    lines = fileContent.split('\n');
  }

  let insertOffset = 0;
  for (const block of diff.blocks) {
    if (isNew) {
      lines = lines.concat(applyBlockChangesToNewFile(block));
    } else {
      const o = applyBlockChangesToExistingFile(lines, block, insertOffset);
      lines = o.lines;
      insertOffset = o.insertOffset;
    }
  }

  // Write the modified content back to the file
  try {
    fs.writeFileSync(newFilePath, lines.join('\n'));
  } catch (err) {
    console.error(`Error writing to file ${newFilePath}: ${err}`);
  }
}

function renameFile(oldFilePath: string, newFilePath: string) {
  try {
    fs.renameSync(oldFilePath, newFilePath);
  } catch (err) {
    console.error(
      `Error renaming file from ${oldFilePath} to ${newFilePath}: ${err}`
    );
    return false;
  }
  return true;
}

function deleteFile(filePath: string) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`Error deleting file ${filePath}: ${err}`);
    return false;
  }
  return true;
}

export function applyBlockChangesToExistingFile(
  lines: string[],
  block: DiffBlock,
  insertOffset: number
) {
  for (const diffLine of block.lines) {
    if (diffLine.type === LineType.CONTEXT && insertOffset === 0) {
      const adjustedLine = block.newStartLine + insertOffset - 1;
      if (lines[adjustedLine] !== diffLine.content.slice(1)) {
        if (lines[adjustedLine + 1] === diffLine.content.slice(1)) {
          block.newStartLine++;
        } else if (
          adjustedLine > 0 &&
          lines[adjustedLine - 1] === diffLine.content.slice(1)
        ) {
          block.newStartLine--;
        } else {
          console.error(
            `Error: Cannot find matching context line at ${adjustedLine} for file`
          );
          return { lines: lines, insertOffset: insertOffset };
        }
      }
    }

    const adjustedLine = block.newStartLine + insertOffset - 1;
    if (diffLine.type === LineType.INSERT) {
      lines.splice(adjustedLine, 0, diffLine.content.slice(1));
      insertOffset++;
    } else if (diffLine.type === LineType.DELETE) {
      lines.splice(adjustedLine, 1);
    } else if (diffLine.type === LineType.CONTEXT) {
      insertOffset++;
    }

    // For LineType.CONTEXT, do nothing because the line is unchanged
  }
  return { lines: lines, insertOffset: insertOffset };
}

function applyBlockChangesToNewFile(block: DiffBlock) {
  const lines: string[] = [];
  for (const diffLine of block.lines) {
    if (diffLine.type === LineType.INSERT) {
      lines.push(diffLine.content.slice(1));
    } // For LineType.DELETE and LineType.CONTEXT, do nothing because there's no content in a new file
  }
  return lines;
}

export default applyDiff;
