import glTF from "./glTF";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import directoryStructure from "shared-resources/backend/utils/directory-structure";
import parseContentBrowserData from "./parse-content-browser-data";
import {readRegistry} from "../utils/fs-operations";
import ROUTES from "../../../src/static/ROUTES";
import levelLoader from "./level-loader";
import buildSettingsWindow from "./build-settings-window";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import frameMenuController from "../utils/frame-menu-controller";

const {ipcMain, dialog} = require("electron")
const fs = require("fs")
const pathRequire = require("path")

export default function projectEvents(pathToProject, window, metadata) {
    let settingsWindowIsOpen = false
    ipcMain.on(ROUTES.LOAD_LEVEL, (_, pathToLevel) => levelLoader(window.webContents, pathToLevel, pathToProject.replace(PROJECT_FILE_EXTENSION, "")))
    ipcMain.on(ROUTES.OPEN_FULL, () => {
        setTimeout(() => {
            frameMenuController(window)
            window.maximize()
            window.webContents.send(ROUTES.OPEN_FULL)
        }, 250)
    })
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

    ipcMain.on(ROUTES.READ_FILE, async (event, {pathName, type, listenID}) => {
        const result = await new Promise(resolve => {
            fs.readFile(pathRequire.resolve(pathName), (e, res) => {
                try {
                    switch (type) {
                        case "buffer":
                            resolve(res)
                            break
                        case "json":
                            try {
                                resolve(JSON.parse(res.toString()))
                            } catch (error) {
                                console.error(error)
                                resolve(null)
                            }

                            break
                        case "base64":
                            resolve(new Buffer(res).toString("base64"))
                            break
                        default:
                            resolve(res.toString())
                            break
                    }
                } catch (e) {
                    resolve()
                }
            })
        })
        event.sender.send(ROUTES.READ_FILE + listenID, result)
    })

    ipcMain.on(ROUTES.FILE_DIALOG, (ev, {listenID}) => {
        const properties = ["openFile", "multiSelections"]
        dialog.showOpenDialog({
            properties, filters: [{name: "Assets", extensions: ["jpg", "png", "jpeg", "gltf", "hdri"]}]
        })
            .then(result => {
                if (!result.canceled)
                    ev.sender.send(ROUTES.FILE_DIALOG + listenID, result.filePaths)
                else
                    ev.sender.send(ROUTES.FILE_DIALOG + listenID, [])
            })
            .catch(err => console.error(err))
    })

    ipcMain.on(ROUTES.REFRESH_CONTENT_BROWSER, async (event, {pathName, listenID}) => {
        const result = []
        const registryData = (await readRegistry(pathName + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)).filter(reg => reg)
        const res = await directoryStructure(pathName)
        for (let i = 0; i < res.length; i++) {
            try {
                const e = await parseContentBrowserData(res[i], registryData, pathName)
                if (e && (e.registryID || e.isFolder))
                    result.push(e)
            } catch (error) {
                console.error(error)
            }
        }
        event.sender.send(ROUTES.REFRESH_CONTENT_BROWSER + listenID, result)
    })
    ipcMain.on(ROUTES.READ_REGISTRY, async (event, {pathName, listenID}) => {
        const result = await readRegistry(pathName)
        event.sender.send(ROUTES.READ_REGISTRY + listenID, result)
    })

    ipcMain.on(ROUTES.IMPORT_GLTF, async (event, {filePath, newRoot, options, projectPath, fileName, listenID}) => {
        fs.readFile(pathRequire.resolve(filePath), async (e, data) => {
            if (!e) {
                const file = data.toString()
                const idsToLoad = await glTF(newRoot, fileName, projectPath, file, options, filePath, listenID)
                event.sender.send(ROUTES.IMPORT_GLTF + listenID, idsToLoad)
            } else event.sender.send(ROUTES.IMPORT_GLTF + listenID, [])
        })
    })
}