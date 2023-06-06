import { contextBridge, ipcRenderer, shell } from 'electron';
import { machineIdSync } from 'node-machine-id';
import { getContentsForFiles } from './fileContent';
import { applyDiff } from './fileEdit';
import { getFileTree } from './fileTree';

contextBridge.exposeInMainWorld('electron', {
  openDialog: async (method: string, config: any) => {
    return await ipcRenderer.invoke('dialog', method, config);
  },
  getContents: async (paths: string[]) => {
    return getContentsForFiles(paths);
  },
  getTree: async (path: string, maxDepth: number) => {
    return getFileTree(path, maxDepth);
  },
  applyDiff: async (diff: any) => {
    return applyDiff(diff);
  },
  getUid: () => {
    return machineIdSync(true);
  },
  openExternal: async (url: string) => {
    return shell.openExternal(url);
  },
  ipcRenderer: {
    on: (channel: string, callback: any) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});
