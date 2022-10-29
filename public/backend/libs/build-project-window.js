import readFile from "shared-resources/backend/utils/read-file";
import contextMenuController from "shared-resources/backend/context-menu-controller";
import PROJECT_PATH from "shared-resources/PROJECT_PATH";
import projectEvents from "./project-events";
import ProjectMap from "./ProjectMap";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import logToWindow from "./log-to-window";
import AssimpLoader from "./assimp/AssimpLoader";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const {BrowserWindow} = require("electron")
const path = require("path");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"

export default async function buildProjectWindow(pathToProject, isDev) {
    try {
        const basePath = pathToProject.replace(PROJECT_FILE_EXTENSION, "")
        await AssimpLoader.initialize()
        await ProjectMap.initialize(basePath)
        const metadata = await readTypedFile(pathToProject, "json")

        if (!metadata)
            return false
        const window = new BrowserWindow({
            width: 600,
            height: 600,
            darkTheme: true,
            autoHideMenuBar: true,
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
        logToWindow(window)
        window.setMenu(null)
        window.on("ready-to-show", () => {
            window.show()
        })
        if (isDev)
            window.openDevTools({mode: "detach"})

        projectEvents(pathToProject, window, metadata)
        await window.loadFile(path.join(__dirname, '../index.html'))
        await window.webContents.executeJavaScript(`sessionStorage.setItem("${PROJECT_PATH}", "${pathToProject.replaceAll("\\", "\\\\")}"); `)

        contextMenuController(window, metadata.id)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}


