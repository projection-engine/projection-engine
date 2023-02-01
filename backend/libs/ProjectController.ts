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
import ROUTES from "../static/ROUTES";

const {BrowserWindow, screen, ipcMain, webContents, dialog, Menu,} = require("electron")
const fs = require("fs")
const path = require("path");
const RELATIVE_LOGO_PATH = "./APP_LOGO.png"
const isDev = require("electron-is-dev")

enum CurrentWindow {
    EDITOR,
    PROJECTS,
    NONE
}

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
    static #currentWindow = CurrentWindow.NONE

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

    static openEditorWindow() {
        if (ProjectController.#currentWindow === CurrentWindow.EDITOR)
            return
        ProjectController.#currentWindow = CurrentWindow.EDITOR
        ProjectController.window.loadFile(path.join(__dirname, './editor-window.html'))
            .then(() => {
                ProjectController.window.webContents.send(ROUTES.EDITOR_INITIALIZATION, ProjectController.pathToProject)
                ProjectController.window.maximize()
            })
            .catch()

    }

    static openProjectWindow() {
        if (ProjectController.#currentWindow === CurrentWindow.PROJECTS)
            return
        ProjectController.window.unmaximize()
        const primaryDisplay = screen.getPrimaryDisplay()
        const {width, height} = primaryDisplay.workAreaSize
        ProjectController.#currentWindow = CurrentWindow.PROJECTS
        ProjectController.window.loadFile(path.join(__dirname, './project-window.html')).catch()
        ProjectController.window.setSize(width / 2, height / 2)
    }

    static async openWindow() {
        if (ProjectController.window)
            return;
        const primaryDisplay = screen.getPrimaryDisplay()
        const {width, height} = primaryDisplay.workAreaSize

        ProjectController.window = new BrowserWindow({
            width: width / 2,
            height: height / 2,
            darkTheme: true,
            autoHideMenuBar: true,
            titleBarStyle: 'hidden',
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
        ProjectController.window.on("ready-to-show", () => {
            ProjectController.window.show()
        })
        if (isDev)
            // @ts-ignore
            ProjectController.window.openDevTools({mode: "detach"})

        ProjectController.openProjectWindow()
        ProjectController.window.webContents.on('unresponsive', async () => {
            const { response } = await dialog.showMessageBox({
                message: 'Application is unresponsive',
                title: 'Do you want to try reloading the app?',
                buttons: ['OK', 'Cancel'],
                cancelId: 1
            })
            if (response === 0) {
                ProjectController.window.webContents.forcefullyCrashRenderer()
                ProjectController.window.webContents.reload()
            }
        })
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
        ProjectController.#currentWindow = undefined
        ProjectController.openEditorWindow()
    }
}