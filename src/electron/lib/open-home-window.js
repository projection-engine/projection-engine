const {BrowserWindow, ipcMain} = require("electron")
const Window = require("./Window")
const FRAME_EVENTS = require("../static/FRAME_EVENTS")
const path = require("path");

module.exports = function openHomeWindow() {
    const window = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        frame: false,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
        },
        autoHideMenuBar: true,
        icon: path.resolve(__dirname , "../../assets/logo.png")
    });

    window.loadFile(Window.home);
    ipcMain.on(FRAME_EVENTS.MINIMIZE_MAIN, () => window.minimize())
    ipcMain.on(FRAME_EVENTS.MAXIMIZE_MAIN, () => {
        if (window.isMaximized()) {
            window.unmaximize()
            window.setSize(800, 600)
            return
        }
        window.maximize()
    })
    ipcMain.on(FRAME_EVENTS.CLOSE_MAIN, () => window.close())

}