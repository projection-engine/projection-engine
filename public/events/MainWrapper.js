import Settings from "../windows/Settings"
import FRAME_EVENTS from "../FRAME_EVENTS"

const {BrowserWindow, ipcMain} = require("electron")



export default function MainWrapper() {
    let project = null,
        mainWindow= null,
        currentListeners = {
            close: undefined,
            minimize: undefined,
            maximize: undefined,
            shortcuts: undefined
        }
    function removeEvents() {

        currentListeners.minimize?.removeAllListeners(FRAME_EVENTS.MINIMIZE)
        currentListeners.maximize?.removeAllListeners(FRAME_EVENTS.MAXIMIZE)
        currentListeners.close?.removeAllListeners(FRAME_EVENTS.CLOSE)
        currentListeners.shortcuts?.close()
      
    }

    prepareHomeWindow()
    initEvents(mainWindow)
    ipcMain.on("switch-window", onSwitchCall)
    ipcMain.on("load-page", (ev) =>  ev.sender.send("page-load-props", project))
    function prepareHomeWindow() {
        if (mainWindow) {
            removeEvents()
            mainWindow.close()
        }
        project = null
        const newWindow = new BrowserWindow({
            width: 800,
            height: 650,
            frame: false,
            webPreferences: {
                webSecurity: false,
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
                nodeIntegrationInWorker: true,
            },
            autoHideMenuBar: true
        })
        mainWindow = newWindow
        newWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch()
        return newWindow
    }
    function initEvents(window) {
        currentListeners.minimize = ipcMain.on(FRAME_EVENTS.MINIMIZE, () => window.minimize())
        currentListeners.maximize = ipcMain.on(FRAME_EVENTS.MAXIMIZE, () => {
            if (window.isMaximized())
                window.setSize(800, 650)
            else
                window.maximize()
        })
        currentListeners.close = ipcMain.on(FRAME_EVENTS.CLOSE, () => window.close())
        if(project)
            currentListeners.shortcuts = new Settings()
    }


    function prepareProjectWindow(data) {
        removeEvents()
        mainWindow.close()
        const newWindow = new BrowserWindow({
            show: false,
            frame: false,
            webPreferences: {
                webSecurity: false,
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
                nodeIntegrationInWorker: true,
            },
            autoHideMenuBar: true
        })
        mainWindow = newWindow
        newWindow.maximize()
        newWindow.show()

        newWindow.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY).catch()
        project = {
            package: data
        }
        return newWindow
    }


    function onSwitchCall(_, d) {
        const newWindow  = project ? prepareHomeWindow() : prepareProjectWindow(d.data)

        initEvents(newWindow)
    }
}