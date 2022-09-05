const {ipcMain, dialog} = require("electron")
const fs = require("fs")
const pathRequire = require("path")
const ROUTES = require("../../assets/ROUTES");
const {readRegistry} = require("../utils/file-system/fs-operations");
const parsePath = require("../utils/file-system/parse-content-browser-data");
const glTF = require("./glTF");
const readFile = require("../utils/file-system/read-file")
const lstat = require("../utils/file-system/lstat")
const rm = require("../utils/file-system/rm")
const readdir = require("../utils/file-system/readdir")
const directoryStructure = require("../utils/file-system/directory-structure")
const REG_PATH = require("../../assets/REG_PATH")

module.exports = function () {
    ipcMain.on("fs-read", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await readFile(path, options)
        event.sender.send("fs-read-" + listenID, result)
    })

    ipcMain.on("fs-write", async (event, pkg) => {
        const {
            path, data, listenID
        } = pkg
        const result = await new Promise(resolve => {
            fs.writeFile(pathRequire.resolve(path), data, (err) => resolve([err]))
        })
        event.sender.send("fs-write-" + listenID, result)
    })


    ipcMain.on("fs-rm", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await rm(path, options)
        event.sender.send("fs-rm-" + listenID, result)
    })

    ipcMain.on("fs-mkdir", async (event, data) => {
        const {
            path, listenID
        } = data
        const result = await new Promise(resolve => {
            fs.mkdir(pathRequire.resolve(path), (err) => resolve([err]))
        })
        event.sender.send("fs-mkdir-" + listenID, result)
    })

    ipcMain.on("fs-stat", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await new Promise(resolve => {
            fs.stat(pathRequire.resolve(path), options, (err, res) => resolve([err, res ? {isDirectory: res.isDirectory(), ...res} : undefined]))
        })
        event.sender.send("fs-stat-" + listenID, result)
    })

    ipcMain.on("fs-exists", async (event, data) => {
        const {
            path, listenID
        } = data
        const result = fs.existsSync(pathRequire.resolve(path))
        event.sender.send("fs-exists-" + listenID, result)
    })

    ipcMain.on("fs-readdir", async (event, data) => {
        const {
            path, options, listenID
        } = data

        const result = await readdir(path, options)
        event.sender.send("fs-readdir-" + listenID, result)
    })

    ipcMain.on("fs-lstat", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await lstat(path, options)
        event.sender.send("fs-lstat-" + listenID, result)
    })

    ipcMain.on("fs-rename", async (event, data) => {
        const {
            oldPath, newPath, listenID
        } = data
        const result = await new Promise(resolve => {
            fs.rename(pathRequire.resolve(oldPath), pathRequire.resolve(newPath), (err) => resolve([err]))
        })
        event.sender.send("fs-rename-" + listenID, result)
    })


    ipcMain.on(ROUTES.READ_FILE, async (event, {pathName, type, listenID}) => {
        const result = await new Promise(resolve => {
            fs.readFile(pathRequire.resolve(pathName), (e, res) => {
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
        const registryData = (await readRegistry(pathName + pathRequire.sep + REG_PATH)).filter(reg => reg)
        const res = await directoryStructure(pathName)
        for (let i = 0; i < res.length; i++) {
            try{
                const e = await parsePath(res[i], registryData, pathName)
                if (e && (e.registryID || e.isFolder))
                    result.push(e)
            }catch (error){
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


