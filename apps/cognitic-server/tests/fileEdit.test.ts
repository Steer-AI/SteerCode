import {applyBlockChangesToExistingFile} from '../routes/fileEdit';
import {parse} from 'diff2html';

const getFiles = () => {

 return {
  ogFile: ["Apple", "Banana", "Cherry", "", "Elderberry"], 
  newFile: ["Apple", "Blueberry", "Cherry", "Durian", "", "Elderberry"]
};}

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
`

  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const {ogFile, newFile} = getFiles();
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
`

  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];

  const {ogFile, newFile} = getFiles();
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
`
  const ogFile = ["Apple", "Banana", "Cherry", "Durian", "Elderberry", "Fig", "Honeydew"];
  const newFile = ["Apple", "Blueberry", "Cherry", "Durian", "Durian", "Elderberry", "Grape", "Honeydew", "Ice Cream Bean"];
  const change = parse(diff);
  const file = change[0];
  let lines = [...ogFile];
  
  for(let block of file.blocks) {
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
`
  const ogFile = ["Apple", "Banana", "Cherry"];
  const newFile = ["Apple", "Banana", "Cherry"];
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
`
  const ogFile = ["Apple", "Banana", "Cherry"];
  const newFile = ["Avocado", "Banana", "Cherry"];
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
`
  const ogFile = ["Apple", "Banana", "Cherry"];
  const newFile = ["Apple", "Banana", "Cheese Fruit"];
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
`
  const ogFile = ["Apple", "Banana", "Cherry", "Durian", "Fig"];
  const newFile = ["Apple", "Blueberry", "Cherry", "Elderberry", "Fig"];
  const change = parse(diff);
  const file = change[0];
  const block = file.blocks[0];
  
  const lines = applyBlockChangesToExistingFile(ogFile, block);
  
  expect(lines).toEqual(newFile);
});
