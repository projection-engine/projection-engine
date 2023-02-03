import {BrowserWindow, dialog} from "electron";
import * as path from "path";
import MutableObject from "../../engine-core/MutableObject";
import * as isDev from "electron-is-dev"

const RELATIVE_LOGO_PATH = "./APP_LOGO.png"
export default function createWindow(settings: MutableObject, isChild?:boolean) {
    const window = new BrowserWindow({
        ...settings,
        darkTheme: true,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        // parent,
        webPreferences: {
            enableBlinkFeatures: "PreciseMemoryInfo",
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true
        },
        show: false,
        icon: path.resolve(__dirname, RELATIVE_LOGO_PATH)
    })

    window.setMenu(null)
    window.once("ready-to-show", () => window.show())
    window.webContents.on('unresponsive', async () => {
        const {response} = await dialog.showMessageBox({
            message: 'Application is unresponsive',
            title: 'Do you want to try reloading the app?',
            buttons: ['OK', 'Cancel'],
            cancelId: 1
        })
        if (response === 0) {
            window.webContents.forcefullyCrashRenderer()
            window.webContents.reload()
        }
    })

    if (isDev) { // @ts-ignore
        window.openDevTools(isChild ? undefined : {mode: "detach"})
    }
    return window
}