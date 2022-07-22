import WINDOWS from "../static/WINDOWS"
import ROUTES from "../static/ROUTES"

const  {v4} = require("uuid")
const {BrowserWindow, ipcMain} = require("electron")

export default class WindowManager {

    id = v4()
    windows = {}
    events = {}
    settings = {
        width: 800,
        height: 650,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
        },
    }
    type
    window
    constructor() {
        ipcMain.on(ROUTES.OPEN_NEW_WINDOW, (event, data) => {
            if(!this.windows[data.type] && this.window)
                this.start(data.type, data.windowSettings, data.windowProps)
        })
    }
    start(type, windowSettings, pageProps){
        this.windows[type] = new BrowserWindow({...this.settings, parent: this.window, ...(windowSettings ? windowSettings : {})})
        switch (type) {
        case WINDOWS.HELP:
            this.windows[type].loadURL(HELP_WEBPACK_ENTRY).catch()
            break
        case WINDOWS.SETTINGS:
            this.windows[type].loadURL(SETTINGS_WEBPACK_ENTRY).catch()
            break

        default:
            this.windows[type].close()
            delete this.windows[type]
            break
        }

        if(this.windows[type]) {
            ipcMain.once(type + ROUTES.CLOSE_NEW_WINDOW, (event, data) => {
                this.window.send(type + ROUTES.CLOSE_NEW_WINDOW, data)
                // RESPONDING TO MAIN WINDOW WITH CHILD RESULT
                this.windows[type].close()
                delete this.windows[type]
            })
            ipcMain.once(type + ROUTES.ON_NEW_WINDOW, () => {
                this.window.send(type + ROUTES.ON_NEW_WINDOW, pageProps)
                // ON NEW WINDOW LOAD SEND PROPS
            })
        }
    }
}