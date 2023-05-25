"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBlockChangesToExistingFile = exports.applyFileDiff = exports.applyDiff = void 0;
var diff2html_1 = require("diff2html"); // Update this to your actual imports
var types_1 = require("diff2html/lib/types");
var fs = require('fs');
var applyDiff = function (diff) {
    var change = (0, diff2html_1.parse)(diff);
    for (var _i = 0, change_1 = change; _i < change_1.length; _i++) {
        var file = change_1[_i];
        applyFileDiff(file);
    }
};
exports.applyDiff = applyDiff;
function applyFileDiff(diff) {
    var oldFilePath = diff.oldName;
    var newFilePath = diff.newName;
    // check if the file is new
    var isNew = oldFilePath === "/dev/null";
    // check if the file has been renamed
    var isRenamed = oldFilePath !== newFilePath && oldFilePath !== "/dev/null";
    // check if the file has been deleted
    var isDeleted = newFilePath === "/dev/null";
    if (isDeleted && deleteFile(oldFilePath)) {
        return; // No need to apply diff to a deleted file
    }
    if (isRenamed && !renameFile(oldFilePath, newFilePath)) {
        return;
    }
    var lines = [];
    if (!isNew) {
        // Read the current file
        var fileContent = '';
        try {
            fileContent = fs.readFileSync(newFilePath, 'utf8');
        }
        catch (err) {
            console.error("Error reading file ".concat(newFilePath, ": ").concat(err));
            return;
        }
        lines = fileContent.split('\n');
    }
    for (var _i = 0, _a = diff.blocks; _i < _a.length; _i++) {
        var block = _a[_i];
        if (isNew) {
            lines = lines.concat(applyBlockChangesToNewFile(block));
        }
        else {
            lines = applyBlockChangesToExistingFile(lines, block);
        }
    }
    // Write the modified content back to the file
    try {
        fs.writeFileSync(newFilePath, lines.join('\n'));
    }
    catch (err) {
        console.error("Error writing to file ".concat(newFilePath, ": ").concat(err));
    }
}
exports.applyFileDiff = applyFileDiff;
function renameFile(oldFilePath, newFilePath) {
    try {
        fs.renameSync(oldFilePath, newFilePath);
    }
    catch (err) {
        console.error("Error renaming file from ".concat(oldFilePath, " to ").concat(newFilePath, ": ").concat(err));
        return false;
    }
    return true;
}
function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    }
    catch (err) {
        console.error("Error deleting file ".concat(filePath, ": ").concat(err));
        return false;
    }
    return true;
}
function applyBlockChangesToExistingFile(lines, block) {
    var insertOffset = 0;
    for (var _i = 0, _a = block.lines; _i < _a.length; _i++) {
        var diffLine = _a[_i];
        var adjustedLine = block.newStartLine + insertOffset - 1;
        if (diffLine.type === types_1.LineType.INSERT) {
            lines.splice(adjustedLine, 0, diffLine.content.slice(1));
            insertOffset++;
        }
        else if (diffLine.type === types_1.LineType.DELETE) {
            lines.splice(adjustedLine, 1);
        }
        else if (diffLine.type === types_1.LineType.CONTEXT) {
            insertOffset++;
        }
        // For LineType.CONTEXT, do nothing because the line is unchanged
    }
    return lines;
}
exports.applyBlockChangesToExistingFile = applyBlockChangesToExistingFile;
function applyBlockChangesToNewFile(block) {
    var lines = [];
    for (var _i = 0, _a = block.lines; _i < _a.length; _i++) {
        var diffLine = _a[_i];
        if (diffLine.type === types_1.LineType.INSERT) {
            lines.push(diffLine.content.slice(1));
        } // For LineType.DELETE and LineType.CONTEXT, do nothing because there's no content in a new file
    }
    return lines;
}
exports.default = exports.applyDiff;
