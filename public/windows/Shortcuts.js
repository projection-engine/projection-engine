import FRAME_EVENTS from "../FRAME_EVENTS"

const  {v4} = require("uuid")

const {BrowserWindow, ipcMain} = require("electron")

export default class Shortcuts{
    id = v4()
    listenerRoute = "open-shortcuts"
    window
    events = {}
    constructor() {
        this.listener = ipcMain.on(this.listenerRoute, (event, {data}) => {
            this.start()
        })
    }
    start(){
        this.window = new BrowserWindow({
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
        })
        this.window.loadURL(SHORTCUTS_WEBPACK_ENTRY).catch()
        this.events.close = ipcMain.on(FRAME_EVENTS.CLOSE_SHORTCUTS,() => this.close())
        this.events.close = ipcMain.on(FRAME_EVENTS.MAXIMIZE_SHORTCUTS,() => {
            if (this.window.isMaximized())
                this.window.setSize(800, 650)
            else
                this.window.maximize()
        })
        this.events.close = ipcMain.on(FRAME_EVENTS.MINIMIZE_SHORTCUTS,() => this.window.minimize())

    }
    close(){
        if(this.window)
            this.window.close()

        this.listener.removeAllListeners(this.listenerRoute)
    }
}