import ImageProcessor from "../../engine/utils/image/ImageProcessor"
import {v4, v4 as uuidv4} from "uuid"
import AsyncFS from "../AsyncFS"

const pathRequire = window.require("path")

const {ipcRenderer} = window.require("electron")
export default class FileSystem {
    static sep = pathRequire.sep
    static registry = []

    constructor(projectID) {
        this._path = (localStorage.getItem("basePath") + "projects" + FileSystem.sep + projectID)

        new Promise(async resolve => {
            if (!await AsyncFS.exists(this.path + FileSystem.sep + "previews")) await AsyncFS.mkdir(this.path + FileSystem.sep + "previews")
            if (!await AsyncFS.exists(this.path + FileSystem.sep + "assets")) await AsyncFS.mkdir(this.path + FileSystem.sep + "assets")
            if (!await AsyncFS.exists(this.path + FileSystem.sep + "assetsRegistry")) await AsyncFS.mkdir(this.path + FileSystem.sep + "assetsRegistry")
            if (!await AsyncFS.exists(this.path + FileSystem.sep + "logic")) await AsyncFS.mkdir(this.path + FileSystem.sep + "logic")

            resolve()
        }).catch(err => console.error(err))
    }

    get path() {
        return this._path
    }

    async writeFile(pathName, data) {
        const result = await AsyncFS.write(FileSystem.resolvePath(this.path + pathName), typeof data === "object" ? JSON.stringify(data) : data)

        if(result[0])
            throw Error(result[0])
    }

    async readFile(pathName, type) {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once("read-file-" + listenID, (ev, data) => resolve(data))
            ipcRenderer.send("read-file", {pathName, type, listenID})
        })
    }

    async findRegistry(p) {
        const [, res] = await AsyncFS.readdir(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry"))
        if (res) {
            const registryData = await Promise.all(res.map(data => this.readRegistryFile(data.replace(".reg", ""))))
            const parsedPath = pathRequire.resolve(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

    async deleteFile(pathName, options) {
        const p = pathName.replaceAll(FileSystem.sep + FileSystem.sep, FileSystem.sep)
        const currentPath = this._path + FileSystem.sep + p
        for(let i = 0; i < FileSystem.registry.length; i++){
            const r = FileSystem.registry[i]
            const rPath = "assets" +FileSystem.sep + r.path
            if(rPath.includes(p))
                await AsyncFS.rm(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + r.id + ".reg"))
        }
        await AsyncFS.rm(currentPath, options)
        
        const rs = await this.findRegistry(currentPath)
        if (rs) await AsyncFS.rm(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + rs.id + ".reg"))
    }

    async importImage(newRoot, res, fileID) {
        if (res && !(await AsyncFS.exists(newRoot + ".pimg"))) {

            await AsyncFS.write(newRoot + ".pimg", res)
            const reduced = await ImageProcessor.resizeImage(res, 256, 256)
            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "previews" + FileSystem.sep + fileID + ".preview"), reduced)
            await this.createRegistryEntry(fileID, newRoot.replace(this.path + FileSystem.sep + "assets" + FileSystem.sep, "") + ".pimg")
        }
    }

    async openDialog() {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once("dialog-response-" + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send("open-file-dialog", {listenID})
        })
    }

    async importFile(targetDir, filesToLoad) {
        let result = []
        for (let i in filesToLoad) {
            const filePath = filesToLoad[i]
            const name = filePath.split(pathRequire.sep).pop()

            const newRoot = targetDir + pathRequire.sep + name.split(".")[0]
            const fileID = uuidv4()
            const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
            switch (type) {
            case "png":
            case "jpg":
            case "jpeg": {
                const file = await this.readFile(filePath, "buffer")
                await this.importImage(newRoot, `data:image/${type};base64,` + new Buffer(file).toString("base64"), fileID)
                break
            }
            case "gltf":
                result.push({
                    file: name.split(".")[0],
                    ids: await new Promise(resolve => {
                        const listenID = v4().toString()
                        ipcRenderer.once("import-gltf-" + listenID, (ev, data) => {
                            resolve(data)
                        })

                        ipcRenderer.send("import-gltf", {
                            filePath: filePath,
                            newRoot,
                            options: {},
                            projectPath: this.path,
                            listenID,
                            fileName: filePath.split(pathRequire.sep).pop()
                        })
                    })
                })
                break
            default:
                break
            }
        }
        return result
    }

    async createRegistryEntry(fID = uuidv4(), path) {
        const pathRe = FileSystem.resolvePath(this.path + FileSystem.sep + "assets")
        const p = FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path).replace(pathRe, "")
        await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + fID + ".reg"), JSON.stringify({
            id: fID, path: p
        }))
    }

    async readRegistryFile(id) {
        try {
            return await this.readFile(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + id + ".reg"), "json")
        } catch (e) {
            return null
        }
    }

    async assetExists(path) {
        return await AsyncFS.exists(FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path))
    }

    async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : uuidv4()
        await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path), fileData)
        if (previewImage)
            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "previews" + FileSystem.sep + registryID + ".preview"), previewImage)
        await this.createRegistryEntry(fileID, path)
    }


    async updateAsset(registryID, fileData, previewImage) {
        const res = await this.readRegistryFile(registryID)
        if(res)
            await this.writeAsset(res.path, fileData, previewImage, registryID)
        else
            throw Error("Not found")
    }

    async deleteEntity(entityID) {
        await this.deleteFile("logic" + FileSystem.sep + entityID + ".entity")
    }

    async updateEntity(entity, id) {
        const p = FileSystem.resolvePath(this.path + FileSystem.sep + "logic")
        await AsyncFS.write(FileSystem.resolvePath(p + FileSystem.sep  +id + ".entity"), entity)
    }

    async updateProject(meta, settings) {
        if (meta) await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + ".meta"), JSON.stringify(meta))
        if (settings) {
            let sett = {...settings}
            delete sett.type
            delete sett.data
            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + ".settings"), JSON.stringify(sett))
        }
    }

    async fromDirectory(startPath, extension) {
        if (!(await AsyncFS.exists(startPath))) return []
        let res = []
        let files = (await AsyncFS.readdir(startPath))[1]
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i])
            const stat = (await AsyncFS.lstat(filename))[1]
            if (stat.isDirectory) {
                res.push(...(await this.fromDirectory(filename, extension)))
            } else if (filename.indexOf(extension) >= 0) res.push(files[i])
        }
        return res
    }

    async foldersFromDirectory(startPath) {
        if (!(await AsyncFS.exists(startPath))) return []
        let res = []
        let files = (await AsyncFS.readdir(startPath))[1]
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i])
            const stat = (await AsyncFS.lstat(filename))[1]

            if (stat.isDirectory) res.push(filename)
        }
        return res
    }

    async rename(from, to) {
        const fromResolved = pathRequire.resolve(from)
        let newRegistry = await this.readRegistry()
        return new Promise(async rootResolve => {
            const stat = (await AsyncFS.lstat(fromResolved))[1]
            if (stat !== undefined && stat.isDirectory) {
                await AsyncFS.mkdir(to)
                const [error, res] = await AsyncFS.readdir(fromResolved)
                if (res) {

                    for (let i in res) {
                        const file = res[i]
                        const oldPath = fromResolved + FileSystem.sep + `${file}`
                        const newPath = to + FileSystem.sep + `${file}`
                        if ((await AsyncFS.lstat(oldPath))[1].isDirectory) {
                            await this.rename(oldPath, newPath)
                        } else {
                            await AsyncFS.rename(oldPath, newPath)
                            await this.updateRegistry(oldPath, newPath, newRegistry)
                        }
                    }
                    await AsyncFS.rm(fromResolved, {recursive: true, force: true})
                    rootResolve()
                } else rootResolve(error)
            } else if (stat !== undefined) {
                await AsyncFS.rename(fromResolved, to)
                await this.updateRegistry(from, to, newRegistry)
                rootResolve()
            } else rootResolve()
        })

    }


    async readRegistry() {
        const promise = await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once("read-registry-" + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send("read-registry", {pathName: FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry"), listenID})
        })
        FileSystem.registry = promise
        return promise
    }

    async updateRegistry(from, to, registryData) {
        const assetsResolved = pathRequire.resolve(this.path + FileSystem.sep + "assets")
        const fromResolved = pathRequire.resolve(from).replace(assetsResolved, "")
        const toResolved = pathRequire.resolve(to)
        const registryFound = registryData.find(reg => {
            const regResolved = pathRequire.resolve(this.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path).replace(assetsResolved, "")
            return regResolved === fromResolved
        })
        if (registryFound) await AsyncFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, "")
        }))
    }


    static async createProject(name) {

        const projectID = uuidv4(),
            projectPath = localStorage.getItem("basePath") + "projects" + FileSystem.sep + projectID
        if (!(await AsyncFS.exists(FileSystem.resolvePath(localStorage.getItem("basePath") + "projects")))) await AsyncFS.mkdir(FileSystem.resolvePath(localStorage.getItem("basePath") + "projects"))
        const [err] = await AsyncFS.mkdir(projectPath)
        if(!err) {
            await AsyncFS.write(FileSystem.resolvePath(projectPath + FileSystem.sep + ".meta"), JSON.stringify({
                id: projectID, name: name, creationDate: new Date().toDateString()
            }))
        }
        return projectID
    }

    static resolvePath(path) {
        return pathRequire.resolve(path)
    }

}


