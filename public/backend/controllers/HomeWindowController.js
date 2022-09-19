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

module.exports = function HomeWindow(projects) {
    let isClosed = false
    this.id = v4()

    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const window = new BrowserWindow({
        minWidth: Math.max(width * .60, 800),
        minHeight: Math.max(height * .60, 600),
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
    app.on('browser-window-focus', (event, win) => {
        if (win === window) {
            window.webContents.send(ROUTES.HOME_WINDOW_FOCUS + this.id, true)
        }
    })
    app.on('browser-window-blur', (event, win) => {
        if (win === window)
            window.webContents.send(ROUTES.HOME_WINDOW_FOCUS + this.id, false)
    })

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
        const found = projects.get(data.id)
        if (!found) {
            const projectWindow = ProjectWindow(() => {
                try {
                    projects.delete(data.id)
                    if (!window)
                        return
                    if (!isClosed)
                        window.show()
                    window.webContents.send(ROUTES.WINDOW_CLOSED + this.id)
                } catch (err) {
                    console.error(err)
                }

            }, {...data})
            projects.set(data.id, projectWindow.id)
            window.minimize()
        } else
            found.window.show()
    })
}