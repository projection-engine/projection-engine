const {BrowserWindow, ipcMain} = require('electron')

const closeEventHome = 'home-close',
    minimizeEventHome = 'home-minimize',
    maximizeEventHome = 'home-maximize'
const closeEvent = 'project-close',
    minimizeEvent = 'project-minimize',
    maximizeEvent = 'project-maximize'

export default class WindowEvents {
    project = null

    currentListeners = {
        close: undefined,
        minimize: undefined,
        maximize: undefined,
    }

    constructor() {
        this.getData = this.getDataCall.bind(this)
        this.onSwitch = this.onSwitchCall.bind(this)

        this.prepareHomeWindow()
        this.initEvents(this.mainWindow, maximizeEventHome, minimizeEventHome, closeEventHome)

        ipcMain.on('switch-window', this.onSwitch)
        ipcMain.on('load-page', this.getData)
    }

    initEvents(window, mE, minE, closeE) {
        this.currentListeners.minimize = ipcMain.on(minE, () => window.minimize())
        this.currentListeners.maximize = ipcMain.on(mE, () => {
            if (window.isMaximized())
                window.setSize(800, 650)
            else
                window.maximize()
        })
        this.currentListeners.close = ipcMain.on(closeE, () => window.close())
    }

    removeEvents() {
        if (this.project) {
            this.currentListeners.minimize?.removeAllListeners(maximizeEvent)
            this.currentListeners.maximize?.removeAllListeners(minimizeEvent)
            this.currentListeners.close?.removeAllListeners(closeEvent)
        } else {
            this.currentListeners.minimize?.removeAllListeners(maximizeEventHome)
            this.currentListeners.maximize?.removeAllListeners(minimizeEventHome)
            this.currentListeners.close?.removeAllListeners(closeEventHome)
        }
    }

    getDataCall(ev) {
        ev.sender.send('page-load-props', this.project)
    }

    prepareProjectWindow(data) {
        this.removeEvents()
        this.mainWindow.close()
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
        });
        this.mainWindow = newWindow
        newWindow.maximize();
        newWindow.show();

        newWindow.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY);
        this.project = {
            package: data,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        }
        return {
            newWindow,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        }
    }

    prepareHomeWindow() {
        if(this.mainWindow) {
            this.removeEvents()
            this.mainWindow.close()
        }
        this.project = null
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
        });
        this.mainWindow = newWindow
        newWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

        return {
            newWindow,
            closeEvent: closeEventHome,
            minimizeEvent: minimizeEventHome,
            maximizeEvent: maximizeEventHome
        }
    }

    onSwitchCall(_, d) {
        const {
            newWindow,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        } = this.project ? this.prepareHomeWindow() : this.prepareProjectWindow(d.data)

        this.initEvents(newWindow, maximizeEvent, minimizeEvent, closeEvent)
    }
}