import PROJECT_FOLDER_STRUCTURE from "../../static/objects/PROJECT_FOLDER_STRUCTURE";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "../../static/objects/FILE_TYPES";
import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";
import MutableObject from "../../engine-core/static/MutableObject";
import RegistryFile from "../../static/objects/RegistryFile";
import AssimpLoader from "./assimp/AssimpLoader";
import fileSystem from "../utils/file-system";
import ROUTES from "../static/ROUTES";
import {BrowserWindow, screen} from "electron"
import * as fs from "fs";
import * as path from "path";
import createWindow from "../utils/create-window";
import ContextMenuController from "./ContextMenuController";
import WindowTypes from "../static/WindowTypes";
import initializeListeners from "../utils/initialize-listeners";


enum CurrentWindow {
    EDITOR,
    PROJECTS,
    NONE
}

export default class WindowController {
    static id?: string
    static pathToProject?: string
    static pathToAssets?: string
    static pathToPreviews?: string
    static pathToRegistry?: string
    static registry: { [key: string]: RegistryFile } = {}
    static window: BrowserWindow
    static windows: BrowserWindow[] = []
    static metadata: MutableObject
    static preventAppClosing: boolean = false
    static #currentWindow = CurrentWindow.NONE

    static findWindow(id) {
        try {
            if (WindowController.window.webContents.id === id)
                return WindowController.window

            for (let i = 0; i < WindowController.windows.length; i++) {
                try {
                    const window = WindowController.windows[i]
                    if (window.webContents.id === id)
                        return window
                } catch (err) {
                    WindowController.windows.splice(i, 1)
                    console.log(err)
                }
            }
        } catch (err) {
            return
        }
    }

    static closeSubWindows() {
        WindowController.windows.forEach(w => {
            try {
                w?.destroy?.()
            } catch (err) {
                console.log(err)
            }
        })
        WindowController.windows = []
    }

    static async initialize() {
        if (WindowController.window)
            return;

        const log = console.error
        console.error = (...msg) => {
            log(...msg)
            WindowController.window.webContents.send("console", msg)
        }
        fileSystem()
        await AssimpLoader.initialize()
        initializeListeners()

        WindowController.pathToRegistry = undefined
        WindowController.metadata = undefined
        WindowController.registry = {}
        WindowController.pathToProject = undefined
        WindowController.id = undefined
        WindowController.pathToAssets = undefined
        WindowController.pathToPreviews = undefined

        const primaryDisplay = screen.getPrimaryDisplay()
        const {width, height} = primaryDisplay.workAreaSize

        WindowController.window = createWindow({width: width / 2, height: height / 2})
        ContextMenuController.initialize()
        WindowController.openProjectWindow()
    }

    static openEditorWindow() {
        if (WindowController.#currentWindow === CurrentWindow.EDITOR)
            return

        WindowController.closeSubWindows()
        WindowController.#currentWindow = CurrentWindow.EDITOR
        WindowController.window.loadFile(path.join(__dirname, './editor-window.html'))
            .then(() => {
                WindowController.window.webContents.send(ROUTES.EDITOR_INITIALIZATION, WindowController.pathToProject)
                WindowController.window.maximize()
            })
            .catch()

    }

    static addWindow(settings: MutableObject, type: number) {
        switch (type) {
            case WindowTypes.PREFERENCES: {
                const primaryDisplay = screen.getPrimaryDisplay()
                const {width, height} = primaryDisplay.workAreaSize
                const newWindow = createWindow({
                    width: width * (settings.widthScale || 1),
                    height: height * (settings.heightScale || 1)
                }, true)
                newWindow.loadFile(path.join(__dirname, './preferences-window.html')).catch()
                newWindow.on("close", () => {
                    try {
                        WindowController.windows = WindowController.windows.filter(w => w !== newWindow)
                    } catch (err) {
                        console.log(err)
                    }
                })
                WindowController.windows.push(newWindow)
                break
            }
        }
    }

    static openProjectWindow() {
        if (WindowController.#currentWindow === CurrentWindow.PROJECTS)
            return

        WindowController.closeSubWindows()
        WindowController.window.unmaximize()
        const primaryDisplay = screen.getPrimaryDisplay()
        const {width, height} = primaryDisplay.workAreaSize
        WindowController.#currentWindow = CurrentWindow.PROJECTS
        WindowController.window.loadFile(path.join(__dirname, './project-window.html')).catch()
        WindowController.window.setSize(width / 2, height / 2)

    }

    static async prepareForUse(pathTo: string) {

        WindowController.pathToRegistry = pathTo + path.sep + FILE_TYPES.REGISTRY
        WindowController.metadata = <MutableObject>await readTypedFile(pathTo + path.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "json") || {}
        WindowController.registry = <{ [key: string]: RegistryFile }>await readTypedFile(WindowController.pathToRegistry, "json") || {}
        WindowController.pathToProject = pathTo
        WindowController.id = pathTo.split(path.sep).pop()
        WindowController.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        WindowController.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)

        Object.entries(WindowController.registry)
            .forEach((param: [string, RegistryFile]) => {
                const exists = fs.existsSync(path.resolve(WindowController.pathToAssets + path.sep + param[1].path))
                if (!exists)
                    delete WindowController.registry[param[0]]
            })
        WindowController.#currentWindow = undefined
        WindowController.openEditorWindow()
    }
}