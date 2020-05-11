// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {screen} = require('electron').remote
const {ipcRenderer} = require('electron')

window.application = {
  log: (text) => {
    ipcRenderer.invoke('log', text)
  },
  getAllDisplays: () => {
    window.application.log("Getting all displays")
    return screen.getAllDisplays();
  },
  setSelectedDisplay: (displayId) => {
    window.application.log(`Telling main to select a display ${displayId}`)
    return ipcRenderer.invoke('set-selected-display', displayId);
  },
  showAllDisplays: () => {
    window.application.log("Telling main to show all displays")
    ipcRenderer.invoke('show-all-displays');
  },
  showWarning: () => {
    window.application.log("Telling main to show warning")
    ipcRenderer.invoke('log', '')
    ipcRenderer.invoke('show-warning');
  },
  quitApplication: () => {
    window.application.log("Telling main to quit")
    ipcRenderer.invoke('quit-application');
  },
}
