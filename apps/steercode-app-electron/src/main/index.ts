import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, shell } from 'electron';
import serve from 'electron-serve';
import windowStateManager from 'electron-window-state';
import { join, resolve } from 'path';

import './ipc';
import initUpdater from './updater';

const serveURL = serve({ directory: join(__dirname, '..', 'renderer') });
const port = process.env.WEB_PORT || 5173;
const dev = is.dev && process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow | null = null;

function logBoth(...args: any[]) {
  console.log(...args);
  mainWindow && mainWindow.webContents.send('log', ...args);
}

function createWindow() {
  if (mainWindow) return mainWindow;

  const windowState = windowStateManager({
    defaultWidth: 1024,
    defaultHeight: 600
  });

  mainWindow = new BrowserWindow({
    backgroundColor: 'whitesmoke',
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    movable: true,
    trafficLightPosition: {
      x: 17,
      y: 32
    },
    minHeight: 450,
    minWidth: 1024,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      spellcheck: false,
      devTools: true,
      preload: join(__dirname, '../preload/index.js')
    },
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height
  });

  windowState.manage(mainWindow);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', () => {
    if (!mainWindow) return;
    windowState.saveState(mainWindow);
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) return;
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    logBoth('open handler', details);
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  logBoth('dev', dev);
  if (dev) {
    loadVite();
    mainWindow.webContents.openDevTools();
    // mainWindow.loadURL(import.meta.env.MAIN_VITE_ELECTRON_RENDERER_URL)
  } else {
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    serveURL(mainWindow);
  }

  initUpdater(mainWindow, logBoth);
  return mainWindow;
}

function loadVite() {
  if (!mainWindow) return;
  mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
    logBoth('Error loading URL, retrying', e.message);
    setTimeout(() => {
      loadVite();
    }, 200);
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Handle the protocol
  app.on('open-url', (_, url) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      createWindow();
    }

    handleDeepLink(url);
  });

  app.on('second-instance', (_, commandLine, __) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else {
      createWindow();
    }
    // the commandLine is array of strings in which last element is deep link url
    // the url str ends with /
    const url = commandLine.pop();
    if (url) {
      handleDeepLink(url);
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // Handle deeplink
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('steercode', process.execPath, [
          resolve(process.argv[1])
        ]);
      }
    } else {
      app.setAsDefaultProtocolClient('steercode');
    }

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.steercode.electron.app');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function handleDeepLink(url: string) {
  if (!mainWindow) return;
  logBoth(`handleDeepLink ${url}`);

  if (url.startsWith('steercode://auth')) {
    const urlParams = new URLSearchParams(url.replace('steercode://auth?', ''));
    const credential = urlParams.get('credential');
    const providerId = urlParams.get('providerId');
    if (credential && providerId) {
      mainWindow.webContents.send('auth', credential, providerId);
    }
    return;
  }

  const _url = url.replace('steercode://', '');
  mainWindow.webContents.send('open-page', _url);
}
