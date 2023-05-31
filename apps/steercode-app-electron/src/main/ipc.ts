import { app, dialog, ipcMain } from 'electron';

app.whenReady().then(() => {
  ipcMain.handle('dialog', async (_, method, config) => {
    const result = await dialog[method](config);
    return result;
  });
});
