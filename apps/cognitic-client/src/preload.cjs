const { contextBridge, ipcRenderer, dialog } = require('electron');
const {
  getContentsForFiles,
  getFileTree
} = require('./lib/data/localQueries.cjs');
const {
  applyDiff
} = require('./lib/data/fileEdit.cjs');
const { machineIdSync } = require('node-machine-id');

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
  getUid: () => {
    return machineIdSync(true);
  }
});
