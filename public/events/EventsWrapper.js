import {app} from "electron";

const {BrowserWindow, ipcMain} = require('electron')
const si = require("systeminformation");

export default class EventsWrapper {
    windows = []

    constructor(mainWindow) {
        this.mainWindow = mainWindow
        const loader = this.loader.bind(this)
        const closeEvent = 'home-close',
            minimizeEvent = 'home-minimize',
            maximizeEvent = 'home-maximize'
        ipcMain.on(minimizeEvent, () => {
            console.log('HERE')
            mainWindow.minimize()
        })
        ipcMain.on(maximizeEvent, () => {
            console.log('HERE')
            mainWindow.maximize()
        })
        ipcMain.on(closeEvent, () => {
            console.log('HERE')
            mainWindow.close()
        })

        ipcMain.on('load-page', loader)
        this.onLoadPage = this.onLoad.bind(this)

    }

    loader(ev) {
        ev.sender.send('page-load-props', this.windows[this.windows.length - 1])
    }

    onLoad(_, d) {
        const {
            windowID,
            data
        } = d
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
        newWindow.maximize();
        newWindow.show();
        const closeEvent = windowID + '-close',
            minimizeEvent = windowID + '-minimize',
            maximizeEvent = windowID + '-maximize'


        newWindow.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY);

        this.windows.push({
            package: data,
            pageID: windowID,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        })

        console.trace('HERE')
        ipcMain.on(minimizeEvent, () => {
            newWindow.minimize()
        })
        ipcMain.on(maximizeEvent, () => {
            newWindow.maximize()
        })
        ipcMain.on(closeEvent, () => {
            newWindow.close()
        })
    }

    listen() {

        ipcMain.on('get-current-load', async (event) => {
            const load = await si.currentLoad()
            event.sender.send('current-load', load)
        })

        ipcMain.on('create-project-window', this.onLoadPage)
    }
}