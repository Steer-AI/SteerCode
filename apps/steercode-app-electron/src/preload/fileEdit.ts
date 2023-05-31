// import { parse } from 'diff2html'; // Update this to your actual imports
import { promises as fs } from 'fs';
import { parse } from './conflictParser';
import type { IMergeMarkersDiff } from './types';

export const applyDiff = async (diff: string) => {
  const changes = parse(diff);
  console.log(changes);
  for (const change of changes) {
    await applyFileDiff(change);
  }
};

const applyFileDiff = async (diff: IMergeMarkersDiff) => {
  let isNewFile = false;
  try {
    await fs.access(diff.fileName, fs.constants.F_OK);
  } catch (err) {
    isNewFile = true;
  }

  if (isNewFile) {
    if (diff.head)
      throw new Error(
        'There is existing content for file that is supposed to be new, LLM probably used wrong file name'
      );
    await fs.writeFile(diff.fileName, diff.incoming, 'utf-8');
  } else {
    await applyMergeDiff(diff);
  }
};

function printStringDifference(string1: string, string2: string): void {
  const differences: string[] = [];

  [...string1, ...string2].forEach((_, index) => {
    if (string1[index] !== string2[index]) {
      differences.push(
        `Index ${index}: ${string1[index] || '-'} != ${string2[index] || '-'}`
      );
    }
  });

  console.log(
    differences.length === 0
      ? 'The strings are identical.'
      : 'Differences found:'
  );
  console.log(differences.join('\n'));
}

const applyMergeDiff = async (diff: IMergeMarkersDiff): Promise<void> => {
  const content = await fs.readFile(diff.fileName, 'utf-8');
  const flexibleHead =
    '\\s*' +
    diff.head
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+') +
    '\\s*';
  const regex = new RegExp(flexibleHead, 'g');
  const firstMatch = regex.exec(content);

  if (!firstMatch) {
    printStringDifference(content, diff.head);
    throw new Error(`The string '${diff.head}' was not found in the file.`);
  }

  const secondMatch = regex.exec(content);

  if (secondMatch) {
    throw new Error(
      `There is more than one occurrence of the string '${diff.head}' in the file.`
    );
  }

  const newContent =
    content.substring(0, firstMatch.index) +
    diff.toMergeFormat() +
    content.substring(firstMatch.index + diff.head.length);
  await fs.writeFile(diff.fileName, newContent, 'utf-8');
};

// function renameFile(oldFilePath: string, newFilePath: string) {
//   try {
//     fs.renameSync(oldFilePath, newFilePath);
//   } catch (err) {
//     console.error(
//       `Error renaming file from ${oldFilePath} to ${newFilePath}: ${err}`
//     );
//     return false;
//   }
//   return true;
// }

// function deleteFile(filePath: string) {
//   try {
//     fs.unlinkSync(filePath);
//   } catch (err) {
//     console.error(`Error deleting file ${filePath}: ${err}`);
//     return false;
//   }
//   return true;
// }

// export function applyBlockChangesToExistingFile(
//   lines: string[],
//   block: DiffBlock,
//   insertOffset: number
// ) {
//   for (const diffLine of block.lines) {
//     if (diffLine.type === LineType.CONTEXT && insertOffset === 0) {
//       const adjustedLine = block.newStartLine + insertOffset - 1;
//       if (lines[adjustedLine] !== diffLine.content.slice(1)) {
//         if (lines[adjustedLine + 1] === diffLine.content.slice(1)) {
//           block.newStartLine++;
//         } else if (
//           adjustedLine > 0 &&
//           lines[adjustedLine - 1] === diffLine.content.slice(1)
//         ) {
//           block.newStartLine--;
//         } else {
//           console.error(
//             `Error: Cannot find matching context line at ${adjustedLine} for file`
//           );
//           return { lines: lines, insertOffset: insertOffset };
//         }
//       }
//     }

//     const adjustedLine = block.newStartLine + insertOffset - 1;
//     if (diffLine.type === LineType.INSERT) {
//       lines.splice(adjustedLine, 0, diffLine.content.slice(1));
//       insertOffset++;
//     } else if (diffLine.type === LineType.DELETE) {
//       lines.splice(adjustedLine, 1);
//     } else if (diffLine.type === LineType.CONTEXT) {
//       insertOffset++;
//     }

//     // For LineType.CONTEXT, do nothing because the line is unchanged
//   }
//   return { lines: lines, insertOffset: insertOffset };
// }

// function applyBlockChangesToNewFile(block: DiffBlock) {
//   const lines: string[] = [];
//   for (const diffLine of block.lines) {
//     if (diffLine.type === LineType.INSERT) {
//       lines.push(diffLine.content.slice(1));
//     } // For LineType.DELETE and LineType.CONTEXT, do nothing because there's no content in a new file
//   }
//   return lines;
//}
