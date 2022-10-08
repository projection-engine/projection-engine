const {BrowserWindow, ipcMain} = require("electron")
const path = require("path");
const ROUTES = require("../../../src/static/ROUTES");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"
const {screen} = require('electron')

export default async function buildSettingsWindow(parent, settingsData, onClose) {

    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const window = new BrowserWindow({
        minWidth: Math.max(width / 6, 500),
        minHeight: Math.max(height / 6, 750),
        parent,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
        },
        show: false,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, RELATIVE_LOGO_PATH),
    });

    await window.loadFile(path.join(__dirname, '../preferences-window.html'))
    window.on("close", onClose)
    window.webContents.on(ROUTES.LOAD_SETTINGS, async event => {
        event.sender.send(ROUTES.LOAD_SETTINGS, settingsData)
    })
    window.webContents.on(ROUTES.UPDATE_SETTINGS, (event, data) => {
        parent.send(ROUTES.UPDATE_SETTINGS, data)
    })

    window.on("ready-to-show", () => {
        window.show()
    })
}