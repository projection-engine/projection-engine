import levelLoader from "../utils/level-loader";
import PROJECT_FILE_EXTENSION from "../../shared-resources/PROJECT_FILE_EXTENSION";
import ROUTES from "../static/ROUTES";
import readTypedFile from "../utils/read-typed-file";
import importFiles from "../utils/import-files";
import ProjectController from "./ProjectController";
import resolveFileName from "../utils/resolve-file-name";

import createRegistryEntry from "../utils/create-registry-entry";
import directoryStructure from "../../shared-resources/backend/utils/directory-structure";
import PROJECT_FOLDER_STRUCTURE from "../../static/PROJECT_FOLDER_STRUCTURE";
import parseContentBrowserData from "../utils/parse-content-browser-data";

const {ipcMain, dialog, app, screen} = require("electron")
const fs = require("fs")
const pathRequire = require("path")

export default class Events {
    static initializeListeners(isDev){
        ipcMain.on("reload", Events.reloadWindow)
        ipcMain.on(ROUTES.LOAD_LEVEL, Events.loadLevel)
        ipcMain.on(ROUTES.OPEN_FULL, Events.openFull)
        ipcMain.on(ROUTES.LOAD_PROJECT_METADATA, Events.loadProjectMetadata)

        ipcMain.on(ROUTES.READ_FILE, Events.readFile)
        ipcMain.on(ROUTES.FILE_DIALOG, Events.fileDialog)
        ipcMain.on("resolve-name", Events.resolveName)
        ipcMain.on("update-registry", Events.updateRegistry)

        ipcMain.on("create-registry", Events.createRegistry)
        ipcMain.on(ROUTES.REFRESH_CONTENT_BROWSER, Events.refreshContentBrowser)
        ipcMain.on("read-registry", Events.readRegistry)

        ProjectController.window.setMenu(null)
        ProjectController.window.on("ready-to-show", () => ProjectController.window.show())
        if (isDev)
            ProjectController.window.openDevTools({mode: "detach"})
    }
    static reloadWindow() {
        dialog.showMessageBox(ProjectController.window, {
            'type': 'question',
            'title': 'Reload project',
            'message': "Are you sure?",
            'buttons': [
                'Yes',
                'No'
            ]
        }).then((result) => {
            if (result.response !== 0)
                return;
            app.relaunch()
            app.exit()
        })
    }

    static openFull() {
        setTimeout(() => {
            const primaryDisplay = screen.getPrimaryDisplay()
            const {width, height} = primaryDisplay.workAreaSize
            ProjectController.window.setSize(width / 2, height / 2)
            ProjectController.window.maximize()
            ProjectController.window.webContents.send(ROUTES.OPEN_FULL)
        }, 250)
    }

    static async readFile(event, {pathName, type, listenID}) {
        event.sender.send(ROUTES.READ_FILE + listenID, await readTypedFile(pathName, type))
    }

    static resolveName(event, {ext, path, listenID}) {
        event.sender.send("resolve-name" + listenID, resolveFileName(path, ext))
    }

    static async updateRegistry(event, {id, data}) {
        ProjectController.registry[id] = data
        await fs.promises.writeFile(ProjectController.pathToRegistry, JSON.stringify(ProjectController.registry))
    }

    static async createRegistry(event, data) {
        await createRegistryEntry(data.id, data.path)
        event.sender.send("create-registry" + data.listenID)
    }

    static loadLevel(_, pathToLevel) {
        levelLoader(ProjectController.window.webContents, pathToLevel, ProjectController.pathToProject.replace(PROJECT_FILE_EXTENSION, ""))
    }

    static loadProjectMetadata(event) {
        event.sender.send(ROUTES.LOAD_PROJECT_METADATA, ProjectController.metadata)
    }

    static async fileDialog(ev, {listenID, currentDirectory}) {
        const properties = ["openFile", "multiSelections"]
        const result = await dialog.showOpenDialog({
            properties,
            filters: [{name: "Assets", extensions: ["bin", "jpg", "png", "jpeg", "gltf", "fbx", "glb", "dae"]}]
        })
        let filesImported = result.filePaths || [],
            registryEntries = []
        if (!result.canceled && result.filePaths.length > 0)
            await importFiles(result.filePaths, ProjectController.pathToAssets + pathRequire.sep + currentDirectory, registryEntries)

        ev.sender.send(ROUTES.FILE_DIALOG + listenID, {filesImported, registryEntries})
    }

    static async refreshContentBrowser(event, {pathName, listenID}) {
        const result = []
        const registryData = Object.values(ProjectController.registry)
        const assetsToParse = await directoryStructure(pathName + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        for (let i = 0; i < assetsToParse.length; i++) {
            try {
                const e = await parseContentBrowserData(assetsToParse[i], registryData, pathName)
                if (e && (e.registryID || e.isFolder))
                    result.push(e)
            } catch (error) {
                console.error(error)
            }
        }
        event.sender.send(ROUTES.REFRESH_CONTENT_BROWSER + listenID, result)
    }

    static readRegistry(event, {listenID}) {
        event.sender.send("read-registry" + listenID, ProjectController.registry)
    }
}