import contextMenuController from "shared-resources/backend/context-menu-controller";

import ProjectController from "./ProjectController";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import AssimpLoader from "./assimp/AssimpLoader";
import Events from "./Events";

const {BrowserWindow} = require("electron")
const path = require("path");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"

export default async function window(pathToProject, isDev) {
    try {
        await AssimpLoader.initialize()
        const basePath = pathToProject.replace(PROJECT_FILE_EXTENSION, "")

        ProjectController.window = new BrowserWindow({
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

        await ProjectController.prepareForUse(basePath)
        Events.initializeListeners(isDev)
        contextMenuController(ProjectController.window, ProjectController.metadata.id)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}


