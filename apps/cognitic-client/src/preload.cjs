const { contextBridge, ipcRenderer } = require('electron');
const {
  getContentsForFiles,
  getFileTree
} = require('./lib/data/localQueries.cjs');
const {
  applyDiff
} = require('./lib/data/fileEdit.cjs');

contextBridge.exposeInMainWorld('electron', {
  openDialog: async (method, config) => {
    return await ipcRenderer.invoke('dialog', method, config);
  },
  getContents: async (paths) => {
    return getContentsForFiles(paths);
  },
  getTree: async (path, maxDepth) => {
    return getFileTree(path, maxDepth);
  },
  applyDiff: async (diff) => {
    return applyDiff(diff);
  }
});
