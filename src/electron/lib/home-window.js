const {BrowserWindow, ipcMain} = require("electron")
const Window = require("../Windows")
const FRAME_EVENTS = require("../../assets/FRAME_EVENTS")
const path = require("path");
const ROUTES = require("../../assets/ROUTES");
const {v4} = require("uuid");
const ProjectWindow = require("./project-window")
const windowLifeCycle = require("./window-life-cycle");
const RELATIVE_LOGO_PATH = "../../data/logo.png"
const {screen} = require('electron')

module.exports = function HomeWindow() {
    let projects = [], isClosed = false
    this.id = v4()
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const window = new BrowserWindow({
        minWidth: Math.max(width / 4, 800),
        minHeight: Math.max(height / 4, 600),
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
        const found = projects.find(p => p.id === data.id)
        if (!found?.window) {
            ProjectWindow(() => {
                projects = projects.filter(p => p.id !== data.id)
                if (!isClosed)
                    window.show()
            }, {...data})
            projects.push(data)
            window.minimize()
        } else
            found.window.show()
    })
}