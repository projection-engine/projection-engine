import levelLoader from "../utils/level-loader";

import ROUTES from "../static/ROUTES";
import readTypedFile from "../utils/read-typed-file";
import importFiles from "../utils/import-files";
import WindowController from "./WindowController";
import resolveFileName from "../utils/resolve-file-name";

import createRegistryEntry from "../utils/create-registry-entry";
import directoryStructure from "../utils/directory-structure";
import PROJECT_FOLDER_STRUCTURE from "../../static/objects/PROJECT_FOLDER_STRUCTURE";
import parseContentBrowserData from "../utils/parse-content-browser-data";
import RegistryFile from "../../static/objects/RegistryFile";

import SETTINGS_PATH from "../static/SETTINGS_PATH";
import DEFAULT_GLOBAL_SETTINGS from "../static/DEFAULT_GLOBAL_SETTINGS";

import {app, dialog, ipcMain} from "electron"
import * as os from "os";
import * as fs from "fs";
import * as pathRequire from "path";


export default class Events {
    static initializeListeners() {
        ipcMain.on("reload", () => WindowController.prepareForUse(WindowController.pathToProject).catch())
        ipcMain.on(ROUTES.LOAD_LEVEL, Events.loadLevel)
        ipcMain.on(ROUTES.LOAD_PROJECT_METADATA, Events.loadProjectMetadata)

        ipcMain.on(ROUTES.READ_FILE, Events.readFile)
        ipcMain.on(ROUTES.SET_PROJECT_CONTEXT, (_, pathToProject) => {
            WindowController.prepareForUse(pathToProject).catch()
        })
        ipcMain.on(ROUTES.FILE_DIALOG, Events.fileDialog)
        ipcMain.on(ROUTES.OPEN_WINDOW,  (_, {windowSettings, type}) => {
            WindowController.addWindow(windowSettings||{}, type)
        })

        ipcMain.on("minimize", ev => {
            const isMainWindow = WindowController.window.id === ev.sender.id
            let window = WindowController.window
            console.log(ev.sender.id, WindowController.windows.map(w => w.id))
            if(!isMainWindow)
                window = WindowController.windows.find(w => w.id === ev.sender.id)
            if(!window)
                return

            window.minimize()
        })
        ipcMain.on("maximize", ev => {
            const isMainWindow = WindowController.window.id === ev.sender.id
            let window = WindowController.window
            if(!isMainWindow)
                window = WindowController.windows.find(w => w.id === ev.sender.id)
            if(!window)
                return

            if (!window.isMaximized())
                window.maximize()
            else
                window.unmaximize()
        })
        ipcMain.on("close", ev => {
            const isMainWindow = WindowController.window.id === ev.sender.id
            if(isMainWindow) {
                WindowController.windows.find(w => w.destroy())
                app.quit()
            }
            else
                WindowController.windows.find(w => w.id === ev.sender.id)?.destroy?.()
        })

        ipcMain.on(ROUTES.OPEN_SELECTION, Events.openSelection)
        ipcMain.on(ROUTES.RESOLVE_NAME, Events.resolveName)
        ipcMain.on(ROUTES.UPDATE_REG, Events.updateRegistry)

        ipcMain.on(ROUTES.CLOSE_EDITOR, () => WindowController.openProjectWindow())
        ipcMain.on(ROUTES.GET_GLOBAL_SETTINGS, async (ev) => {
            try {
                const file = await fs.promises.readFile(os.homedir() + pathRequire.sep + SETTINGS_PATH)
                if (file)
                    ev.sender.send(ROUTES.GET_GLOBAL_SETTINGS, JSON.parse(file.toString()))
                else
                    ev.sender.send(ROUTES.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
            } catch (err) {
                ev.sender.send(ROUTES.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
            }
        })
        ipcMain.on(ROUTES.UPDATE_GLOBAL_SETTINGS, async (_, data) => {
            try {
                const result = await dialog.showMessageBox(WindowController.window, {
                    'type': 'question',
                    'title': 'Reload necessary to apply changes',
                    'message': "Are you sure?",
                    'buttons': [
                        'Yes',
                        'No'
                    ]
                })
                if (result.response !== 0)
                    return;
                await fs.promises.writeFile(os.homedir() + pathRequire.sep + SETTINGS_PATH, JSON.stringify(data)).catch()
                app.relaunch()
                app.quit()
            } catch (err) {
                app.relaunch()
                app.quit()
            }
        })

        ipcMain.on(ROUTES.CREATE_REG, Events.createRegistry)
        ipcMain.on(ROUTES.REFRESH_CONTENT_BROWSER, Events.refreshContentBrowser)
        ipcMain.on(ROUTES.READ_REGISTRY, Events.readRegistry)
    }



    static async openSelection() {
        const {canceled, filePaths} = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        WindowController.window.webContents.send(ROUTES.OPEN_SELECTION, canceled ? null : filePaths[0])
    }

    static async readFile(event, {pathName, type, listenID}) {
        event.sender.send(ROUTES.READ_FILE + listenID, await readTypedFile(pathName, type))
    }


    static resolveName(event, {ext, path, listenID}) {
        event.sender.send(ROUTES.RESOLVE_NAME + listenID, resolveFileName(path, ext))
    }

    static async updateRegistry(event, {id, data}) {
        WindowController.registry[id] = data
        await fs.promises.writeFile(WindowController.pathToRegistry, JSON.stringify(WindowController.registry))
    }

    static async createRegistry(event, data) {
        await createRegistryEntry(data.id, data.path)
        event.sender.send(ROUTES.CREATE_REG + data.listenID)
    }

    static loadLevel(_, pathToLevel) {
        levelLoader(WindowController.window.webContents, pathToLevel).catch()
    }

    static loadProjectMetadata(event) {
        event.sender.send(ROUTES.LOAD_PROJECT_METADATA, WindowController.metadata)
    }

    static async fileDialog(ev, {listenID, currentDirectory}) {
        const properties = <("openFile" | "multiSelections")[]>["openFile", "multiSelections"]
        const result = await dialog.showOpenDialog({
            properties,
            filters: [{name: "Assets", extensions: ["bin", "jpg", "png", "jpeg", "gltf", "fbx", "glb", "dae"]}]
        })
        let filesImported = result.filePaths || [],
            registryEntries = []
        if (!result.canceled && result.filePaths.length > 0)
            await importFiles(result.filePaths, WindowController.pathToAssets + pathRequire.sep + currentDirectory, registryEntries)

        ev.sender.send(ROUTES.FILE_DIALOG + listenID, {filesImported, registryEntries})
    }

    static async refreshContentBrowser(event, {pathName, listenID}) {
        let data = <null | { [key: string]: RegistryFile }>await readTypedFile(WindowController.pathToRegistry, "json").catch()
        if (!data) {
            event.sender.send(ROUTES.REFRESH_CONTENT_BROWSER + listenID, null)
            data = WindowController.registry
        }
        console.error(data)
        try {
            WindowController.registry = data
        } catch (err) {
            console.error(err, data)
        }
        const result = []
        let registryData = Object.values(WindowController.registry)
        const foundIDs = {}
        const pathToAssets = pathName + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.ASSETS
        registryData.forEach(d => {
            if (foundIDs[d.id])
                delete WindowController.registry[d.id]
            foundIDs[d.id] = true
            if (!fs.existsSync(pathToAssets + d.path))
                delete WindowController.registry[d.id]
        })
        registryData = Object.values(WindowController.registry)

        try {
            await fs.promises.writeFile(WindowController.pathToRegistry, JSON.stringify(WindowController.registry))
        } catch (error) {
            console.error(error)
        }
        const assetsToParse = await directoryStructure(pathToAssets)
        console.error(registryData.length, pathToAssets, WindowController.pathToRegistry)

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
        event.sender.send(ROUTES.READ_REGISTRY + listenID, WindowController.registry)
    }
}