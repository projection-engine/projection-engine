const {BrowserWindow, ipcMain, screen} = require("electron")
const Window = require("../Windows")
const FRAME_EVENTS = require("../../static/FRAME_EVENTS")
const path = require("path");
const ROUTES = require("../../static/ROUTES");
const {v4} = require("uuid");
const windowLifeCycle = require("./window-life-cycle");
const loader = require("../events/project-loader/project-loader");
const loadMetadata = require("../events/project-loader/lib/load-metadata");

const getBasePath = require("./get-base-path");
const os = require("os");
const RELATIVE_PATH_LOGO = "../../assets/logo.png"
const settingsWindow = require("./settings-window");

module.exports = function ProjectWindow(handleClose, data) {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const window = new BrowserWindow({
        width: Math.max(width / 2, 800),
        height: Math.max(height / 2, 600),

        frame: false,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true
        },
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, RELATIVE_PATH_LOGO)
    });
    ipcMain.on(ROUTES.LOAD_PROJECT + data.id, async event => {
        await loader(data.id, event.sender)
    })
    ipcMain.on(ROUTES.LOAD_PROJECT_METADATA + data.id, async event => {
        event.sender.send(ROUTES.LOAD_PROJECT_METADATA + data.id, await loadMetadata(getBasePath(os, path) +"projects" + path.sep + data.id))
    })
    ipcMain.on(ROUTES.OPEN_SETTINGS + data.id, async (event, settingsData) => {
      settingsWindow(data.id, window, settingsData)
    })
    windowLifeCycle(
        data.id,
        window,
        () => {
            window.close()
            handleClose()
        },
        () => window.loadFile(Window.project).catch(() => handleClose())
    )


}