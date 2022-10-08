const {BrowserWindow, ipcMain} = require("electron")
const Window = require("../EntryPointController")
const FRAME_EVENTS = require("../../../src/static/FRAME_EVENTS")
const path = require("path");
const ROUTES = require("../../../src/static/ROUTES");
const {v4} = require("uuid");
const ProjectWindow = require("./ProjectWindowController")
const windowLifeCycle = require("../utils/window-life-cycle");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"
const {screen, app} = require('electron')

module.exports = function HomeWindow() {
    let isClosed = false
    this.id = v4()

    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const window = new BrowserWindow({
        minWidth: Math.max(width * .60, 800),
        minHeight: Math.max(height * .60, 600),
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


    windowLifeCycle(
        this.id,
        window,
        () => {
            window.close()
            isClosed = true
        },
        () => window.loadFile(Window.home).catch(err => console.error(err))
    )

    ipcMain.on(ROUTES.OPEN_PROJECT + this.id, (event, data) => {
        ProjectWindow(  {...data})
        window.minimize()
    })
}