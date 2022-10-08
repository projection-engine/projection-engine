import readFile from "../utils/file-system/read-file";
import frameMenuController from "../utils/frame-menu-controller";
import buildSettingsWindow from "./build-settings-window";
import PROJECT_PATH from "../static/PROJECT_PATH";

const {BrowserWindow, ipcMain, screen} = require("electron")
const path = require("path");
const ROUTES = require("../../../src/static/ROUTES");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"
const loadLevel = require("./level-loader");
const contextMenuController = require("../utils/context-menu-controller");

export default async function buildProjectWindow(pathToProject, isDev) {
    try {

        const strData = (await readFile(pathToProject, {}))[1]
        const metadata = JSON.parse(strData)
        if (!metadata)
            return false
        let settingsWindowIsOpen = false
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

        ipcMain.on(
            ROUTES.LOAD_LEVEL,
            (_, pathToLevel) => loadLevel(window.webContents, pathToLevel, pathToProject.replace(".projection", "")))
        ipcMain.on(ROUTES.LOAD_PROJECT_METADATA, event => event.sender.send(ROUTES.LOAD_PROJECT_METADATA, metadata))
        ipcMain.on(
            ROUTES.OPEN_SETTINGS,
            async (event, settingsData) => {
                if (settingsWindowIsOpen)
                    return
                settingsWindowIsOpen = true
                buildSettingsWindow(window, settingsData, () => settingsWindowIsOpen = false).catch()
            }
        )
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

