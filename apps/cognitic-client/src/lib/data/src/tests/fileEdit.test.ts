import { parse } from 'diff2html';
import fs from 'fs';
import path from 'path';
import { applyBlockChangesToExistingFile, applyFileDiff } from '../fileEdit';

const getFiles = () => {
  return {
    ogFile: ['Apple', 'Banana', 'Cherry', '', 'Elderberry'],
    newFile: ['Apple', 'Blueberry', 'Cherry', 'Durian', '', 'Elderberry']
  };
};

test('deleting and inserting on same line', () => {
  const diff = `
--- /Users/skoka/workspace/Cognitic/cognitic/file1.txt
+++ /Users/skoka/workspace/Cognitic/cognitic/file2.txt
@@ -1,3 +1,4 @@
  Apple
-Banana
+Blueberry
  Cherry
+Durian
`;

  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const { ogFile, newFile } = getFiles();
  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('inserting and deleting on same line', () => {
  const diff = `
--- /Users/skoka/workspace/Cognitic/cognitic/file1.txt
+++ /Users/skoka/workspace/Cognitic/cognitic/file2.txt
@@ -1,3 +1,4 @@
  Apple
+Blueberry
-Banana
  Cherry
+Durian
`;

  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const { ogFile, newFile } = getFiles();
  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('multiple edits in document', () => {
  const diff = `
--- a/file1.txt
+++ b/file2.txt
@@ -1,3 +1,4 @@
  Apple
-Banana
+Blueberry
  Cherry
+Durian
@@ -5,3 +6,4 @@
  Elderberry
-Fig
+Grape
  Honeydew
+Ice Cream Bean
`;
  const ogFile = [
    'Apple',
    'Banana',
    'Cherry',
    'Durian',
    'Elderberry',
    'Fig',
    'Honeydew'
  ];
  const newFile = [
    'Apple',
    'Blueberry',
    'Cherry',
    'Durian',
    'Durian',
    'Elderberry',
    'Grape',
    'Honeydew',
    'Ice Cream Bean'
  ];
  const change = parse(diff);
  const file = change[0];
  let lines = [...ogFile];

  for (const block of file.blocks) {
    lines = applyBlockChangesToExistingFile(lines, block);
  }

  expect(lines).toEqual(newFile);
});

test('no edits in document', () => {
  const diff = `
--- a/file1.txt
+++ b/file2.txt
@@ -1,3 +1,3 @@
  Apple
  Banana
  Cherry
`;
  const ogFile = ['Apple', 'Banana', 'Cherry'];
  const newFile = ['Apple', 'Banana', 'Cherry'];
  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('edits at the beginning of document', () => {
  const diff = `
--- a/file1.txt
+++ b/file2.txt
@@ -1,2 +1,2 @@
-Apple
+Avocado
  Banana
`;
  const ogFile = ['Apple', 'Banana', 'Cherry'];
  const newFile = ['Avocado', 'Banana', 'Cherry'];
  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('edits at the end of document', () => {
  const diff = `
--- a/file1.txt
+++ b/file2.txt
@@ -2,2 +2,2 @@
  Banana
-Cherry
+Cheese Fruit
`;
  const ogFile = ['Apple', 'Banana', 'Cherry'];
  const newFile = ['Apple', 'Banana', 'Cheese Fruit'];
  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('changes interspersed with unchanged lines', () => {
  const diff = `
--- a/file1.txt
+++ b/file2.txt
@@ -1,5 +1,5 @@
  Apple
-Banana
+Blueberry
  Cherry
-Durian
+Elderberry
  Fig
`;
  const ogFile = ['Apple', 'Banana', 'Cherry', 'Durian', 'Fig'];
  const newFile = ['Apple', 'Blueberry', 'Cherry', 'Elderberry', 'Fig'];
  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const lines = applyBlockChangesToExistingFile(ogFile, block);

  expect(lines).toEqual(newFile);
});

test('create a file', () => {
  const newFilePath = path.join(process.cwd(), 'file2.txt');
  const diff = `
--- /dev/null
+++ ${newFilePath}
@@ -0,0 +1,2 @@
+Apple
+Banana
`;
  const newFileContent = 'Apple\nBanana';
  const change = parse(diff);
  const file = change[0];
  file.newName = newFilePath; // Replace relative path with absolute path in the diff object
  const block = file.blocks[0];

  // Make sure the file does not exist before the test
  if (fs.existsSync(newFilePath)) {
    fs.unlinkSync(newFilePath);
  }

  applyFileDiff(file);

  expect(fs.readFileSync(newFilePath, 'utf8')).toEqual(newFileContent);

  // Clean up after the test
  fs.unlinkSync(newFilePath);
});

test('remove a file', () => {
  const oldFilePath = path.join(process.cwd(), 'file1.txt');
  const diff = `
--- ${oldFilePath}
+++ /dev/null
@@ -1,2 +0,0 @@
-Apple
-Banana
`;
  const change = parse(diff);
  const file = change[0];
  file.oldName = oldFilePath; // Replace relative path with absolute path in the diff object
  const block = file.blocks[0];

  // Make sure the file exists before the test
  fs.writeFileSync(oldFilePath, 'Apple\nBanana');

  applyFileDiff(file);

  expect(fs.existsSync(oldFilePath)).toEqual(false);
});

test('rename a file', () => {
  const oldFilePath = path.join(process.cwd(), 'file1.txt');
  const newFilePath = path.join(process.cwd(), 'file2.txt');
  const diff = `
--- ${oldFilePath}
+++ ${newFilePath}
@@ -1,2 +1,2 @@
 Apple
-Banana
+Blueberry
`;
  const newFileContent = 'Apple\nBlueberry';
  const change = parse(diff);
  const file = change[0];
  file.oldName = oldFilePath; // Replace relative path with absolute path in the diff object
  file.newName = newFilePath;
  const block = file.blocks[0];

  // Make sure the old file exists before the test
  fs.writeFileSync(oldFilePath, 'Apple\nBanana');

  // Make sure the new file does not exist before the test
  if (fs.existsSync(newFilePath)) {
    fs.unlinkSync(newFilePath);
  }

  applyFileDiff(file);

  // The old file should not exist anymore
  expect(fs.existsSync(oldFilePath)).toEqual(false);
  // The new file should exist with the correct content
  expect(fs.readFileSync(newFilePath, 'utf8')).toEqual(newFileContent);

  // Clean up after the test
  fs.unlinkSync(newFilePath);
});
