import {app} from "electron";

const {BrowserWindow, ipcMain} = require('electron')
const si = require("systeminformation");

export default class EventsWrapper {
    windows = {}

    constructor(mainWindow) {
        this.mainWindow = mainWindow
    }

    listen() {
        ipcMain.on('get-current-load', async (event) => {
            const load = await si.currentLoad()
            console.log('HERE')
            event.sender.send('current-load', load)
        })

        ipcMain.on('create-project-window', (_, d) => {
            const {
                windowID,
                data,
                channel,
                closeEvent
            } = d
            const childWindow = new BrowserWindow({
                parent: this.mainWindow,
                width: 700,
                height: 400,
                webPreferences: {
                    webSecurity: false,
                    enableRemoteModule: true,
                    nodeIntegration: true,
                    contextIsolation: false,
                    nativeWindowOpen: true,
                    nodeIntegrationInWorker: true,

                },

                resizable: false,
                frame: false,
                autoHideMenuBar: true,
            });
            childWindow.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY);
            childWindow.webContents.send(channel, data);

            this.windows[windowID] = childWindow
            ipcMain.on(closeEvent, () => {
                console.log('CLOSING')
                childWindow.close()
            })
        })

    }
}