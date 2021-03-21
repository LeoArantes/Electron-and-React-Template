import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { getWindow, setWindow } from "./window";

async function createWindow(): Promise<BrowserWindow>  {
  const win = new BrowserWindow({
    width: 1100,
    minWidth: 500,
    height: 600,
    minHeight: 500,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    win.loadURL(`file://${__dirname}/../index.html`);
  }

    win.on("ready-to-show", (): void => {
        win.show();
    });

  win.on('closed', () => setWindow(null));

  if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    //win.webContents.openDevTools();
  }

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    setWindow(null);
    app.quit();
  }
});

app.on('activate', async (): Promise<void> => {
    if (!getWindow()) {
        setWindow(await createWindow());
    }
});

(async (): Promise<void> => {
	await app.whenReady();

	//initIpcListeners();
	setWindow(await createWindow());
})();