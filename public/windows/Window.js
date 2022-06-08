import FRAME_EVENTS from "../FRAME_EVENTS"
const  {v4} = require("uuid")
const {BrowserWindow, ipcMain} = require("electron")

export default class Window {
    id = v4()
    window
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
    constructor(listenerRoute) {
        this.listenerRoute = listenerRoute
        this.listener = ipcMain.on(this.listenerRoute, () => {
            this.start()
        })
    }
    start(WINDOW, close, minimize, maximize){
        this.window = new BrowserWindow(this.settings)
        this.window.loadURL(WINDOW).catch()
        if(close)
            this.events.close = ipcMain.on(close,() => this.close())
        this.events.maximize = ipcMain.on(maximize,() => {
            if (this.window.isMaximized())
                this.window.setSize(800, 650)
            else
                this.window.maximize()
        })
        this.events.minimize = ipcMain.on(minimize,() => this.window.minimize())
        this.closeListener = close
        this.minimizeListener = minimize
        this.maximizeListener = maximize
    }
    close(){
        if(this.window)
            this.window.close()

        if(this.events.close)
            this.events.close.removeAllListeners(this.closeListener)
        if(this.events.maximize)
            this.events.maximize.removeAllListeners(this.events.maximizeListener)
        if(this.events.minimize)
            this.events.minimize.removeAllListeners(this.events.minimizeListener)

        this.listener.removeAllListeners(this.listenerRoute)
    }
}