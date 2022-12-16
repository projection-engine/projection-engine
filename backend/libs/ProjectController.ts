import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import PROJECT_PATH from "shared-resources/PROJECT_PATH";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import {BrowserWindow} from "electron"

const fs = require("fs")

const path = require("path");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"

export default class ProjectController {
    static id: string|undefined
    static pathToProject: string
    static pathToAssets: string
    static pathToPreviews: string
    static pathToRegistry: string
    static registry: { [key: string]: string } = {}
    static window: BrowserWindow
    static metadata: { [key: string]: any }
    private static initialized: boolean = false

    private static async  initialize(): Promise<void> {
        if (ProjectController.initialized)
            return;
        ProjectController.window = new BrowserWindow({
            width: 600,
            height: 600,
            darkTheme: true,
            autoHideMenuBar: true,
            webPreferences: {
                enableBlinkFeatures: "PreciseMemoryInfo",
                webSecurity: false,
                // enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                // nativeWindowOpen: true,
                nodeIntegrationInWorker: true
            },
            show: false,
            icon: path.resolve(__dirname, RELATIVE_LOGO_PATH)
        })
        ProjectController.initialized = true
        const log = console.error
        console.error = (...msg) => {
            log(...msg)
            ProjectController.window.webContents.send("console", msg)
        }
        await ProjectController.window.loadFile(path.join(__dirname, './index.html'))
    }

    static async prepareForUse(pathTo: string) {
        await ProjectController.initialize()
        await ProjectController.window.webContents.executeJavaScript(`sessionStorage.setItem("${PROJECT_PATH}", "${pathTo.replaceAll("\\", "\\\\")}"); `)

        ProjectController.pathToProject = pathTo
        ProjectController.metadata = await readTypedFile(pathTo + path.sep + PROJECT_FILE_EXTENSION, "json") || {}
        ProjectController.id = pathTo.split(path.sep).pop()
        ProjectController.pathToRegistry = pathTo + path.sep + FILE_TYPES.REGISTRY
        ProjectController.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        ProjectController.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)

        ProjectController.registry = await readTypedFile(ProjectController.pathToRegistry, "json") || {}
        Object.entries(ProjectController.registry)
            .forEach((param: string[]) => {
                const exists = fs.existsSync(path.resolve(ProjectController.pathToAssets + path.sep + param[1]))
                if (!exists)
                    delete ProjectController.registry[param[0]]
            })
    }
}