require('dotenv').config();
const fs = require('fs');
const path = require('path');
const electron_notarize = require('electron-notarize');

module.exports = async function (params) {  
  if (process.platform !== 'darwin') {
    return;
  }

  console.log('afterSign hook triggered', params);

  const appId = 'com.steercode.electron.app';

  const appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    console.log('skip');
    return;
  }

  console.log(
    `Notarizing ${appId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`
  );

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.error('Please provide APPLE_ID and APPLE_ID_PASSWORD in .env');
    return;
  }

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
