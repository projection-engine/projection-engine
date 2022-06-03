const {ipcMain} = require("electron")
const fs = require("fs")
const path = require("path")

const parse = (p) => {
    return path.resolve(p)
}
export async function readFile(path, options) {
    return await new Promise(resolve => {
        fs.readFile(parse(path), options, (err, res) => resolve([err, res ? res.toString() : undefined]))
    })
}

export async function rm(path, options) {
    return await new Promise(resolve => {
        fs.rm(parse(path), options, (err) => resolve([err]))
    })
}

export async function lstat(path, options) {
    return await new Promise(resolve => {
        fs.lstat(parse(path), options, (err, res) => resolve([err, res ? {isDirectory: res.isDirectory()} : undefined]))
    })
}
export async function readdir(path, options) {
    return await new Promise(resolve => {
        fs.readdir(parse(path), options, (err, res) => resolve([err, res]))
    })
}

export async function directoryStructure(dir){
    let results = []
    if (fs.existsSync(dir)) {
        const [err, list] = await readdir(dir)
        if (err) return []
        let pending = list.length
        if (!pending) return results
        for (let i in list) {
            let file = path.resolve(dir, list[i])
            const stat = (await lstat(file))[1]
            results.push(file)
            if (stat && stat.isDirectory) {
                const res = await directoryStructure(file)
                results = results.concat(res)
                if (!--pending) return results
            } else if (!--pending) return results
        }
    }
    return []
}

export default function FSEvents() {
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
            fs.writeFile(parse(path), data, (err) => resolve([err]))
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
            fs.mkdir(parse(path), (err) => resolve([err]))
        })
        event.sender.send("fs-mkdir-" + listenID, result)
    })

    ipcMain.on("fs-stat", async (event, data) => {
        const {
            path, options, listenID
        } = data
        const result = await new Promise(resolve => {
            fs.stat(parse(path), options, (err, res) => resolve([err, res ? {isDirectory: res.isDirectory()} : undefined]))
        })
        event.sender.send("fs-stat-" + listenID, result)
    })

    ipcMain.on("fs-exists", async (event, data) => {
        const {
            path, listenID
        } = data
        const result = fs.existsSync(parse(path))
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
            fs.rename(parse(oldPath), parse(newPath), (err) => resolve([err]))
        })
        event.sender.send("fs-rename-" + listenID, result)
    })

}