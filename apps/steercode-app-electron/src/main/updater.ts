import { BrowserWindow, MessageBoxOptions, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export default function initUpdater(mainWindow: BrowserWindow) {
  console.log('init updater');
  // Set the autoUpdater properties
  autoUpdater.allowPrerelease = false; // Optional: set to true if you want to allow pre-release updates
  autoUpdater.autoDownload = true; // Optional: set to false if you want to prompt the user before downloading updates
  autoUpdater.forceDevUpdateConfig = true;
  // Configure autoUpdater
  autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'cognitic',
    owner: 'cognitic-ai',
    private: false
  });

  autoUpdater.checkForUpdatesAndNotify();
  // Check for updates and notify the user if an update is available
  autoUpdater.on('update-available', () => {
    console.log('update available');
    mainWindow.webContents.send('update-available');
  });

  // Notify the user that the update has been downloaded and is ready to install
  autoUpdater.on('update-downloaded', ({ releaseNotes, releaseName }) => {
    console.log('update downloaded', { releaseNotes, releaseName });
    mainWindow.webContents.send('update-downloaded');

    // Notify the user that an update is available and ask if they want to restart the app
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: `A new version (${releaseName}) has been downloaded. Restart the application to apply the update.`,
      detail:
        releaseNotes instanceof Array
          ? releaseNotes.join('\n\n')
          : releaseNotes || undefined
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        // Restart the app if the user clicks "Restart"
        autoUpdater.quitAndInstall();
      }
    });
  });
  // Check for updates periodically
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60 * 60 * 1000); // Check every hour (in milliseconds)
}
