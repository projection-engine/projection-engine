const {BrowserWindow, ipcMain, screen} = require("electron")
const Window = require("../static/Windows")
const FRAME_EVENTS = require("../static/FRAME_EVENTS")
const path = require("path");
const ROUTES = require("../static/ROUTES");
const {v4} = require("uuid");
const windowLifeCycle = require("./window-life-cycle");
const loader = require("../events/project-loader/project-loader");
const RELATIVE_PATH_LOGO = "../../assets/logo.png"

module.exports = function ProjectWindow(handleClose, data) {
    console.log(data)
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