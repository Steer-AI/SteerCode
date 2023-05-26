"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTree = void 0;
var ignore_1 = require("ignore");
var fs = require('fs');
var path = require('path');
var isRelevantFile = function (file) {
    if (file === '.git' ||
        file === '.idea')
        return false;
    if (file === '__pycache__' || file === '.DS_Store' || file === '__MACOSX')
        return false;
    // Additional files and folders to ignore
    if (file === '.vscode' ||
        file === '.svn' ||
        file === '.hg' ||
        file === '.settings' ||
        file.match(/.*\.log$/) ||
        file.match(/.*\.tmp$/) ||
        file.match(/.*\.bak$/) ||
        file.match(/.*~$/))
        return false;
    return true;
};
var getDirectoryContent = function (dirPath, maxDepth) {
    var result = [];
    if (maxDepth <= 0)
        return result;
    fs.readdirSync(dirPath).forEach(function (file) {
        var absolutePath = path.join(dirPath, file);
        var stat = fs.lstatSync(absolutePath);
        if (!isRelevantFile(file)) {
            return;
        }
        // Check for .gitignore files at multiple levels
        var gitignoreFiles = [];
        var currentPath = dirPath;
        while (currentPath !== path.dirname(currentPath)) {
            var gitignorePath = path.join(currentPath, '.gitignore');
            if (fs.existsSync(gitignorePath)) {
                gitignoreFiles.push(gitignorePath);
            }
            currentPath = path.dirname(currentPath);
        }
        // Parse .gitignore files and check if the current file should be ignored
        var ig = (0, ignore_1.default)();
        gitignoreFiles.forEach(function (gitignorePath) {
            var gitignoreContent = fs.readFileSync(gitignorePath).toString();
            ig.add(gitignoreContent);
        });
        var relativePath = path.relative(dirPath, absolutePath);
        if (ig.ignores(relativePath)) {
            return;
        }
        var item = {
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
var getFileTree = function (path, maxDepth) {
    var usedDepht = maxDepth === -1 ? 100 : maxDepth;
    // Check if dirPath is a directory
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        return getDirectoryContent(path, usedDepht || 1);
    }
    else {
        throw new Error("Invalid directory path: ".concat(path));
    }
};
exports.getFileTree = getFileTree;