import glTF from "../gltf-loader/glTF"
import {readRegistry} from "../project-loader/FSOperations"
import loader from "../project-loader/loader"
import {parsePath} from "../utils"
import {directoryStructure} from "./FSEvents"

const {dialog, ipcMain} = require("electron")
const fs = require("fs")
const path = require("path")
const si = require("systeminformation")



export default function FS() {
    ipcMain.on("read-file", async (event, {pathName, type, listenID}) => {
        const result = await new Promise(resolve => {
            fs.readFile(path.resolve(pathName), (e, res) => {
                try {
                    let d = type === "buffer" ? res : (res ? res.toString() : undefined)
                    resolve(type === "json" && d ? JSON.parse(d) : d)
                } catch (e) {
                    resolve()
                }
            })
        })
        event.sender.send("read-file-" + listenID, result)
    })

    ipcMain.on("open-file-dialog", (ev, {listenID}) => {
        const properties = ["openFile", "multiSelections"]
        dialog.showOpenDialog({
            properties, filters: [{name: "Assets", extensions: ["jpg", "png", "jpeg", "gltf", "hdri"]}]
        })
            .then(result => {
                if (!result.canceled)
                    ev.sender.send("dialog-response-" + listenID, result.filePaths)
                else
                    ev.sender.send("dialog-response-" + listenID, [])
            })
            .catch(err => console.error(err))
    })

    // TODO - Implement better performance tracking
    ipcMain.on("get-current-load", async (event) => {
        const load = await si.currentLoad()
        event.sender.send("current-load", load)
    })
    ipcMain.on("refresh-files", async (event, {pathName, listenID}) => {
        const promiseRes = []

        const registryData = (await readRegistry(pathName + "Registry")).filter(reg => reg)
        const res = await directoryStructure(pathName)
        for(let i in res){
            const e = await parsePath(res[i], registryData, pathName)

            if(e && (e.registryID || e.isFolder))
                promiseRes.push(e)
        }
        const sorted = promiseRes.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })

        event.sender.send("refresh-files-"+listenID, sorted)
    })
    ipcMain.on("read-registry", async (event, {pathName, listenID}) => {
        const result = await readRegistry(pathName)
        event.sender.send("read-registry-" + listenID, result)
    })

    ipcMain.on("import-gltf", async (event, {filePath, newRoot, options, projectPath, fileName, listenID}) => {
        fs.readFile(path.resolve(filePath), async (e, data) => {
            if (!e) {
                const file = data.toString()
                const idsToLoad = await glTF(newRoot, fileName, projectPath, file, options, filePath, listenID)
                event.sender.send("import-gltf-" + listenID, idsToLoad)
            } else event.sender.send("import-gltf-" + listenID, [])
        })
    })
    ipcMain.on("load-project", async (event, {projectPath, projectID, listenID}) => {
        await loader(projectPath, projectID, listenID, event.sender)
    })
}