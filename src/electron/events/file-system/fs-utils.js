const glTF = require("../gltf/glTF")
const {readRegistry} = require("../project-loader/lib/fs-operations")
const loader = require("../project-loader/project-loader")
const parsePath = require("../utils")
const {directoryStructure} = require("./fs-essentials")

const {dialog, ipcMain} = require("electron")
const fsUtils = require("fs")
const path = require("path")


module.exports = function FS() {
    ipcMain.on("read-file", async (event, {pathName, type, listenID}) => {
        const result = await new Promise(resolve => {
            fsUtils.readFile(path.resolve(pathName), (e, res) => {
                try {
                    switch (type) {
                        case "buffer":
                            resolve(res)
                            break
                        case "json":
                            resolve(JSON.parse(res.toString()))
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

    ipcMain.on("refresh-files", async (event, {pathName, listenID}) => {
        const promiseRes = []

        const registryData = (await readRegistry(pathName + "Registry")).filter(reg => reg)
        const res = await directoryStructure(pathName)
        for (let i in res) {
            const e = await parsePath(res[i], registryData, pathName)

            if (e && (e.registryID || e.isFolder))
                promiseRes.push(e)
        }
        const sorted = promiseRes.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })

        event.sender.send("refresh-files-" + listenID, sorted)
    })
    ipcMain.on("read-registry", async (event, {pathName, listenID}) => {
        const result = await readRegistry(pathName)
        event.sender.send("read-registry-" + listenID, result)
    })

    ipcMain.on("import-gltf", async (event, {filePath, newRoot, options, projectPath, fileName, listenID}) => {
        fsUtils.readFile(path.resolve(filePath), async (e, data) => {
            if (!e) {
                const file = data.toString()
                const idsToLoad = await glTF(newRoot, fileName, projectPath, file, options, filePath, listenID)
                event.sender.send("import-gltf" + listenID, idsToLoad)
            } else event.sender.send("import-gltf" + listenID, [])
        })
    })
    ipcMain.on("load-project", async (event, {projectPath, projectID, listenID}) => {
        await loader(projectPath, projectID, listenID, event.sender)
    })
}