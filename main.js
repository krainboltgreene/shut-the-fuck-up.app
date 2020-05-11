// Modules to control application life and create native browser window
const { app: application, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { menubar } = require('menubar');
const DecibelMeter = require('decibel-meter');

function showWarning(display) {
  // Create the browser window.
  const warningWindow = new BrowserWindow({
    height: display.size.height,
    width: display.size.width,
    x: display.bounds.x + ((display.bounds.width - (display.size.width / 2)) / 2),
    y: display.bounds.y + ((display.bounds.height - (display.size.height / 2)) / 2),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload-warning.js')
    }
  })

  // and load the index.html of the app.
  warningWindow.loadFile('warning.html');
}

function showPreview(display) {
  // Create the browser window.
  const previewWindow = new BrowserWindow({
    width: display.size.width / 2,
    height: 100,
    x: display.bounds.x + ((display.bounds.width - (display.size.width / 2)) / 2),
    y: display.bounds.y + ((display.bounds.height - 100) / 2),
    center: true,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload-preview.js')
    }
  })

  // and load the index.html of the app.
  previewWindow.loadFile('preview.html', { hash: `${display.id}` })
}

const applicationMenubar = menubar({
  preloadWindow: true,
  browserWindow: {
    width: 300,
    height: 500,
    resizable: false,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload-menubar.js')
    }
  }
});
// applicationMenubar.on('after-create-window', () => applicationMenubar.window.openDevTools());
let warning;
let selectedDisplay;

ipcMain.handle('log', (event, text) => {
  console.log(text);
})

ipcMain.handle('show-all-displays', () => {
  console.log("Showing all displays")
  screen.getAllDisplays().forEach(showPreview)
})

ipcMain.handle('set-selected-display', (event, displayId) => {
  console.log(`Setting selected display to ${displayId}`)
  selectedDisplay = screen.getAllDisplays().find((display) => display.id === displayId)
})

ipcMain.handle('show-warning', () => {
  if (warning) {
    console.log("Already warning")
    return null;
  }
  if (!selectedDisplay) {
    console.log("No selected display")
    return null;
  }

  console.log("Showing warning")

  warning = true

  showWarning(selectedDisplay);

  setTimeout(() => {
    console.log("No longer warning")
    warning = false
  }, 3000)
})

ipcMain.handle('quit-application', () => {
  console.log("Quitting application")
  application.quit();
})

application.on('ready', () => {
  console.log('application is ready');

  applicationMenubar.on('ready', () => {
    console.log('applicationMenubar is ready');
  });
});

application.on('window-all-closed', () => {
  console.log('application is quitting');
  application.quit()
})
