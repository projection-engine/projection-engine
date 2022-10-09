import ROUTES from "../../../src/static/ROUTES";

const {BrowserWindow} = require("electron")
const path = require("path");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"
const {screen, ipcMain} = require('electron')

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

        autoHideMenuBar: true,
        icon: path.resolve(__dirname, RELATIVE_LOGO_PATH),
    });
    ipcMain.once(ROUTES.LOAD_SETTINGS, event => {
        event.sender.send(ROUTES.LOAD_SETTINGS, settingsData)
    })
    window.openDevTools()
    await window.loadFile(path.join(__dirname, '../preferences-window.html'))
    window.on("close", onClose)




}