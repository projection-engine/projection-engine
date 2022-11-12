import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import directoryStructure from "shared-resources/backend/utils/directory-structure";
import parseContentBrowserData from "./parse-content-browser-data";
import ROUTES from "../../../src/static/ROUTES";
import levelLoader from "./level-loader";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import readTypedFile from "../utils/read-typed-file";
import importFiles from "../utils/import-files";
import ProjectMap from "./ProjectMap";
import createRegistryEntry from "../utils/create-registry-entry";
import resolveFileName from "../utils/resolve-file-name";


const {ipcMain, dialog, app, screen} = require("electron")
const fs = require("fs")
const pathRequire = require("path")

export default function projectEvents(pathToProject, window, metadata) {
    ipcMain.on("reload", () => {
        dialog.showMessageBox(window, {
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
    })
    ipcMain.on(ROUTES.LOAD_LEVEL, (_, pathToLevel) => levelLoader(window.webContents, pathToLevel, pathToProject.replace(PROJECT_FILE_EXTENSION, "")))
    ipcMain.on(ROUTES.OPEN_FULL, () => {
        setTimeout(() => {
            const primaryDisplay = screen.getPrimaryDisplay()
            const {width, height} = primaryDisplay.workAreaSize
            window.setSize(width / 2, height / 2)
            window.maximize()
            window.webContents.send(ROUTES.OPEN_FULL)
        }, 250)
    })
    ipcMain.on(ROUTES.LOAD_PROJECT_METADATA, event => event.sender.send(ROUTES.LOAD_PROJECT_METADATA, metadata))


    ipcMain.on(ROUTES.READ_FILE, async (event, {pathName, type, listenID}) => {
        event.sender.send(ROUTES.READ_FILE + listenID, await readTypedFile(pathName, type))
    })

    ipcMain.on(ROUTES.FILE_DIALOG, async (ev, {listenID, currentDirectory}) => {
        const properties = ["openFile", "multiSelections"]
        const result = await dialog.showOpenDialog({
            properties,
            filters: [{name: "Assets", extensions: ["bin", "jpg", "png", "jpeg", "gltf", "fbx", "glb", "dae"]}]
        })
        let filesImported = result.filePaths || [],
            registryEntries = []
        if (!result.canceled && result.filePaths.length > 0)
            await importFiles(result.filePaths, ProjectMap.pathToAssets + pathRequire.sep + currentDirectory, registryEntries)

        ev.sender.send(ROUTES.FILE_DIALOG + listenID, {filesImported, registryEntries})
    })

    ipcMain.on("resolve-name", (event, {ext, path, listenID}) => {
        event.sender.send("resolve-name" + listenID, resolveFileName(path, ext))
    })
    ipcMain.on("update-registry", async (event, {id, data}) => {
        ProjectMap.registry[id] = data
        await fs.promises.writeFile(ProjectMap.pathToRegistry, JSON.stringify(ProjectMap.registry))
    })

    ipcMain.on("create-registry", async (event, data) => {

        await createRegistryEntry(data.id, data.path)
        event.sender.send("create-registry" + data.listenID)
    })
    ipcMain.on(ROUTES.REFRESH_CONTENT_BROWSER, async (event, {pathName, listenID}) => {

        const result = []
        const registryData = Object.values(ProjectMap.registry)
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
    })
    ipcMain.on("read-registry", async (event, {listenID}) => event.sender.send("read-registry" + listenID, ProjectMap.registry))
}