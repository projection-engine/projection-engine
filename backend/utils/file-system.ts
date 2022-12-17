
import directoryStructure from "../../backend/utils/directory-structure";
import readdir from "../../backend/utils/readdir";
import rm from "../../backend/utils/rm";
import readFile from "../../backend/utils/read-file";
import FILE_TYPES from "../../static/FILE_TYPES";

const {ipcMain} = require("electron")
const fs = require("fs")
const pathRequire = require("path")

let watchSignals = []
let filesToWatch = []

function unwatch() {
    for (let i = 0; i < watchSignals.length; i++) {
        const signal = watchSignals[i]
        if (signal)
            signal.close()
    }
    watchSignals = []
}

export default function fileSystem() {
    ipcMain.on("fs-watch", async (ev, path) => {
        if (watchSignals.length > 0)
            unwatch()
        filesToWatch = await directoryStructure(path)
        for (let i = 0; i < filesToWatch.length; i++) {
            const file = filesToWatch[i]
            if (!file.includes(FILE_TYPES.UI_LAYOUT) && !file.includes(FILE_TYPES.COMPONENT))
                continue
            watchSignals.push(fs.watch(file, (event) => {
                if (event === "change")
                    ev.sender.send("fs-watch", file)
            }))
        }

    })

    ipcMain.on("fs-update-watch", async (ev, path) => {
        filesToWatch = await directoryStructure(path)
    })
    ipcMain.on("fs-unwatch", unwatch)

    ipcMain.on("fs-read", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await readFile(path, options)
        event.sender.send("fs-read-" + listenID, result[1])
    })

    ipcMain.on("fs-write", async (event, {path, data, listenID}) => {
        let error
        try {
            await fs.promises.writeFile(pathRequire.resolve(path), data)
        } catch (err) {
            error = err
        }
        event.sender.send("fs-write-" + listenID, error)
    })


    ipcMain.on("fs-rm", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await rm(path, options)
        event.sender.send("fs-rm-" + listenID, result[0])
    })

    ipcMain.on("fs-mkdir", async (event, {path, listenID}) => {

        let error
        try {
            await fs.promises.mkdir(pathRequire.resolve(path))
        } catch (err) {
            error = err
        }
        event.sender.send("fs-mkdir-" + listenID, error)
    })

    ipcMain.on("fs-stat", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await new Promise(resolve => {
            fs.stat(pathRequire.resolve(path), options, (err, res) => resolve(res ? {isDirectory: res.isDirectory(), ...res} : undefined))
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
        event.sender.send("fs-readdir-" + listenID, result[1])
    })


    ipcMain.on("fs-rename", async (event, data) => {
        const {oldPath, newPath, listenID} = data
        let result
        try {
            await fs.promises.rename(pathRequire.resolve(oldPath), pathRequire.resolve(newPath))
        } catch (err) {
            result = err
        }
        event.sender.send("fs-rename-" + listenID, result)
    })
}


