
import frameMenuController from "../utils/frame-menu-controller";
import buildSettingsWindow from "./build-settings-window";

import readFile from "shared-resources/backend/utils/read-file";
import levelLoader from "./level-loader";
import ROUTES from "../../../src/static/ROUTES";
import contextMenuController from "shared-resources/backend/context-menu-controller";
import PROJECT_PATH from "shared-resources/PROJECT_PATH";
import projectEvents from "./project-events";

const {BrowserWindow, ipcMain, screen} = require("electron")
const path = require("path");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"

export default async function buildProjectWindow(pathToProject, isDev) {
    try {

        const strData = (await readFile(pathToProject, {}))[1]
        const metadata = JSON.parse(strData)
        if (!metadata)
            return false
        const primaryDisplay = screen.getPrimaryDisplay()
        const {width, height} = primaryDisplay.workAreaSize

        const window = new BrowserWindow({
            width: width * .75,
            height: height * .75,
            darkTheme: true,
            webPreferences: {
                enableBlinkFeatures: "PreciseMemoryInfo",
                webSecurity: false,
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
                nodeIntegrationInWorker: true
            },
            show: false,
            icon: path.resolve(__dirname, RELATIVE_LOGO_PATH)
        })
        window.on("ready-to-show", () => {
            window.show()
            window.maximize()
        })
        if (isDev)
            window.openDevTools({mode: "detach"})

        projectEvents(pathToProject, window,  metadata)
        await window.loadFile(path.join(__dirname, '../index.html'))
        await window.webContents.executeJavaScript(`sessionStorage.setItem("${PROJECT_PATH}", "${pathToProject.replaceAll("\\", "\\\\")}"); `)

        contextMenuController(window, metadata.id)
        frameMenuController(window)

        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

