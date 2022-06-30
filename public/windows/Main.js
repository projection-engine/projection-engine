import Settings from "./Settings"
import FRAME_EVENTS from "../static/FRAME_EVENTS"
import ROUTES from "../static/ROUTES"
import WindowManager from "./WindowManager"

const {BrowserWindow, ipcMain, nativeTheme} = require("electron")


export default class MainWindow{
    project = null
    _window = null
    currentListeners = {
        close: undefined,
        minimize: undefined,
        maximize: undefined,
        shortcuts: undefined
    }

    get window(){
        return this._window
    }
    set window(data){
        this._window = data
        this.manager.window = this._window
    }
    constructor(){
        this.manager = new WindowManager()
        this.prepareHomeWindow()
        this.initEvents()
        ipcMain.on(ROUTES.SWITCH_MAIN_WINDOW, (_,event) => {
            if(this.project)
                this.prepareHomeWindow()
            else
                this.prepareProjectWindow(event.data)
            this.initEvents()
        })
        ipcMain.on(ROUTES.LOAD_PROJECT, (ev) =>  ev.sender.send(ROUTES.PAGE_PROPS, this.project))
        nativeTheme.themeSource = "dark"

    }
    initEvents() {
        this.currentListeners.minimize = ipcMain.on(FRAME_EVENTS.MINIMIZE, () => this.window.minimize())
        this.currentListeners.maximize = ipcMain.on(FRAME_EVENTS.MAXIMIZE, () => {
            if (this.window.isMaximized())
                this.window.setSize(800, 650)
            else
                this.window.maximize()
        })
        this.currentListeners.close = ipcMain.on(FRAME_EVENTS.CLOSE, () => this.window.close())
        if(this.project)
            this.currentListeners.shortcuts = new Settings()
    }

    removeEvents() {
        this.currentListeners.minimize?.removeAllListeners(FRAME_EVENTS.MINIMIZE)
        this.currentListeners.maximize?.removeAllListeners(FRAME_EVENTS.MAXIMIZE)
        this.currentListeners.close?.removeAllListeners(FRAME_EVENTS.CLOSE)
        this.currentListeners.shortcuts?.close()
    }
    prepareHomeWindow(){
        if (this.window) {
            this.removeEvents()
            this.window.close()
        }
        this.project = null
        this.window = new BrowserWindow({
            width: 900,
            height: 600,
            minHeight: 600,
            minWidth: 900,
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

        this.window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).catch(err => console.log(err))
    }
    prepareProjectWindow(data) {
        this.removeEvents()
        this.window.close()
        this.window = new BrowserWindow({
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

        this.window.maximize()
        this.window.show()
        this.window.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY).catch(err => console.error(err))

        this.project = {
            package: data
        }
    }
}