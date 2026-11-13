const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let win = null;

function createWindow() {
  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  win = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 800,
    minHeight: 480,
    backgroundColor: '#04090e',
    title: 'Тихая заводь',
    autoHideMenuBar: true,
    icon: path.join(__dirname, iconName),
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  Menu.setApplicationMenu(null);
  win.setAspectRatio(16 / 9);

  win.loadFile(path.join(__dirname, 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
  });

  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
