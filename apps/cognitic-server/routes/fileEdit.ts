
import fs from 'fs';
import {parse } from 'diff2html'; // Update this to your actual imports
import { DiffFile, DiffBlock, DiffLine, LineType } from 'diff2html/lib/types';

const applyDiff = (diff: string) => {
    const change = parse(diff);


    for (let file of change) {
        applyFileDiff(file);
    }
}

function applyFileDiff(diff: DiffFile) {
    let oldFilePath = diff.oldName;
    let newFilePath = diff.newName;

    // check if the file is new
    const isNew = oldFilePath === "/dev/null";
    // check if the file has been renamed
    const isRenamed = oldFilePath !== newFilePath && oldFilePath !== "/dev/null";
    // check if the file has been deleted
    const isDeleted = newFilePath === "/dev/null";


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

    for (let block of diff.blocks) {
        if (isNew) {
            lines = lines.concat(applyBlockChangesToNewFile(block));
        } else {
            lines = applyBlockChangesToExistingFile(lines, block);
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
        console.error(`Error renaming file from ${oldFilePath} to ${newFilePath}: ${err}`);
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

export function applyBlockChangesToExistingFile(lines: string[], block: DiffBlock) {
    let insertOffset = 0;
    for (let diffLine of block.lines) {
        const adjustedLine = block.newStartLine + insertOffset - 1;
        if (diffLine.type === LineType.INSERT) {
            lines.splice(adjustedLine, 0, diffLine.content.slice(1));
            insertOffset++;
        } else if (diffLine.type === LineType.DELETE) {
            lines.splice(adjustedLine, 1);
        }
        else if (diffLine.type === LineType.CONTEXT) {
            insertOffset++;
        }
            
        // For LineType.CONTEXT, do nothing because the line is unchanged
    }
    return lines;
}


function applyBlockChangesToNewFile(block: DiffBlock) {
    let lines: string[] = [];
    for (let diffLine of block.lines) {
        if (diffLine.type === LineType.INSERT) {
            lines.push(diffLine.content);
        } // For LineType.DELETE and LineType.CONTEXT, do nothing because there's no content in a new file
    }
    return lines;
}


export default applyDiff;