import PROJECT_FOLDER_STRUCTURE from "../../static/objects/PROJECT_FOLDER_STRUCTURE";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "../../static/objects/FILE_TYPES";
import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";
import MutableObject from "../../engine-core/MutableObject";
import RegistryFile from "../../static/objects/RegistryFile";
import AssimpLoader from "./assimp/AssimpLoader";
import Events from "./Events";
import contextMenuController from "../utils/context-menu-controller";
import fileSystem from "../utils/file-system";

const {BrowserWindow, app, ipcMain, webContents, dialog, Menu,} = require("electron")
const fs = require("fs")
const path = require("path");
const RELATIVE_LOGO_PATH = "./APP_LOGO.png"
const isDev = require("electron-is-dev")

export default class ProjectController {
    static id?: string
    static pathToProject?: string
    static pathToAssets?: string
    static pathToPreviews?: string
    static pathToRegistry?: string
    static registry: { [key: string]: RegistryFile } = {}
    static window
    static metadata: MutableObject
    static preventAppClosing: boolean = false

    static async initialize() {
        const log = console.error
        console.error = (...msg) => {
            log(...msg)
            ProjectController.window.webContents.send("console", msg)
        }
        fileSystem()
        await AssimpLoader.initialize()
        Events.initializeListeners()

        ProjectController.pathToRegistry = undefined
        ProjectController.metadata = undefined
        ProjectController.registry = {}
        ProjectController.pathToProject = undefined
        ProjectController.id = undefined
        ProjectController.pathToAssets = undefined
        ProjectController.pathToPreviews = undefined

    }

    static async openWindow() {
        if (ProjectController.window)
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

        contextMenuController()
        ProjectController.window.setMenu(null)
        ProjectController.window.on("ready-to-show", () => ProjectController.window.show())
        if (isDev) { // @ts-ignore
            ProjectController.window.openDevTools({mode: "detach"})
        }

        await ProjectController.window.loadFile(path.join(__dirname, './index.html'))
        ProjectController.window.webContents.send("project-identifier", ProjectController.pathToProject.replaceAll("\\", "\\\\"))
    }

    static closeWindow(preventAppClosing: boolean) {
        if (!ProjectController.window)
            return
        ProjectController.preventAppClosing = preventAppClosing
        ProjectController.window.close()
        ProjectController.window = undefined
    }

    static async prepareForUse(pathTo: string) {
        ProjectController.pathToRegistry = pathTo + path.sep + FILE_TYPES.REGISTRY
        ProjectController.metadata = <MutableObject>await readTypedFile(pathTo + path.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "json") || {}
        ProjectController.registry = <{ [key: string]: RegistryFile }>await readTypedFile(ProjectController.pathToRegistry, "json") || {}
        ProjectController.pathToProject = pathTo
        ProjectController.id = pathTo.split(path.sep).pop()
        ProjectController.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        ProjectController.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)

        Object.entries(ProjectController.registry)
            .forEach((param: [string, RegistryFile]) => {
                const exists = fs.existsSync(path.resolve(ProjectController.pathToAssets + path.sep + param[1].path))
                if (!exists)
                    delete ProjectController.registry[param[0]]
            })
        await ProjectController.openWindow()
    }
}