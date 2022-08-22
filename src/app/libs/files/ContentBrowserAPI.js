import NodeFS from "../NodeFS";
import FilesAPI from "./FilesAPI";
import FILE_TYPES from "../../../assets/FILE_TYPES";
import RegistryAPI from "./RegistryAPI";
import {v4 as uuidv4, v4} from "uuid";
import IMAGE_WORKER_ACTIONS from "../../windows/project/libs/engine/production/data/IMAGE_WORKER_ACTIONS";
import ROUTES from "../../../assets/ROUTES";

const pathRequire = window.require("path")
const {ipcRenderer} = window.require("electron")

function mapAsset(reg, type) {
    return reg.map(i => new Promise(resolve => {
        const split = i.path.split(FilesAPI.sep)
        resolve({
            type,
            registryID: i.id,
            name: split[split.length - 1].split(".")[0]
        })
    }))
}

export default class ContentBrowserAPI {

    static async rename(from, to) {
        const fromResolved = pathRequire.resolve(from)
        let newRegistry = await RegistryAPI.readRegistry()
        return new Promise(async rootResolve => {
            const stat = (await NodeFS.lstat(fromResolved))[1]
            if (stat !== undefined && stat.isDirectory) {
                await NodeFS.mkdir(to)
                const [error, res] = await NodeFS.readdir(fromResolved)
                if (res) {

                    for (let i in res) {
                        const file = res[i]
                        const oldPath = fromResolved + FilesAPI.sep + `${file}`
                        const newPath = to + FilesAPI.sep + `${file}`
                        if ((await NodeFS.lstat(oldPath))[1].isDirectory) {
                            await FilesAPI.rename(oldPath, newPath)
                        } else {
                            await NodeFS.rename(oldPath, newPath)
                            await RegistryAPI.updateRegistry(oldPath, newPath, newRegistry)
                        }
                    }
                    await NodeFS.rm(fromResolved, {recursive: true, force: true})
                    rootResolve()
                } else rootResolve(error)
            } else if (stat !== undefined) {
                await NodeFS.rename(fromResolved, to)
                await RegistryAPI.updateRegistry(from, to, newRegistry)
                rootResolve()
            } else rootResolve()
        })

    }


    static async fromDirectory(startPath, extension) {
        if (!(await NodeFS.exists(startPath))) return []
        let res = []
        let files = (await NodeFS.readdir(startPath))[1]
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i])
            const stat = (await NodeFS.lstat(filename))[1]
            if (stat && stat.isDirectory) {
                res.push(...(await ContentBrowserAPI.fromDirectory(filename, extension)))
            } else if (filename.indexOf(extension) >= 0) res.push(files[i])
        }
        return res
    }

    static async openDialog() {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once("dialog-response-" + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send("open-file-dialog", {listenID})
        })
    }

    static async foldersFromDirectory(startPath) {
        if (!(await NodeFS.exists(startPath))) return []
        let res = []
        let files = (await NodeFS.readdir(startPath))[1]
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i])
            const stat = (await NodeFS.lstat(filename))[1]

            if (stat.isDirectory) res.push(filename)
        }
        return res
    }


    static async refresh() {
        const reg = await RegistryAPI.readRegistry()
        const imagesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.IMAGE)),
            meshesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MESH)),
            materialsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)),
            componentsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.COMPONENT)),
            stylesheetReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.STYLESHEET)),
            levelsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.LEVEL)),
            uiReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.UI_LAYOUT)),
            promises = []


        promises.push(...mapAsset(imagesReg, FILE_TYPES.IMAGE))
        promises.push(...mapAsset(meshesReg, FILE_TYPES.MESH))
        promises.push(...mapAsset(materialsReg, FILE_TYPES.MATERIAL))
        promises.push(...mapAsset(componentsReg, FILE_TYPES.COMPONENT))
        promises.push(...mapAsset(stylesheetReg, FILE_TYPES.STYLESHEET))
        promises.push(...mapAsset(levelsReg, FILE_TYPES.LEVEL))
        promises.push(...mapAsset(uiReg, FILE_TYPES.UI_LAYOUT))

        const loadedPromises = await Promise.all(promises)
        const result = {
            images: [],
            meshes: [],
            materials: [],
            components: [],
            stylesheets: [],
            levels: [],
            uiLayouts: []
        }

        for (let i = 0; i < loadedPromises.length; i++) {
            const current = loadedPromises[i]
            switch (current.type) {
                case FILE_TYPES.IMAGE:
                    result.images.push(current)
                    break
                case FILE_TYPES.MESH:
                    result.meshes.push(current)
                    break
                case FILE_TYPES.MATERIAL:
                    result.materials.push(current)
                    break
                case FILE_TYPES.COMPONENT:
                    result.components.push(current)
                    break
                case FILE_TYPES.STYLESHEET:
                    result.stylesheets.push(current)
                    break
                case FILE_TYPES.LEVEL:
                    result.levels.push(current)
                    break
                case FILE_TYPES.UI_LAYOUT:
                    result.uiLayouts.push(current)
                    break
                default:
                    break
            }
        }
        return result
    }

    static async importFile(targetDir, filesToLoad) {
        let result = []
        for (let i = 0; i < filesToLoad.length; i++) {
            const filePath = filesToLoad[i]
            const name = filePath.split(pathRequire.sep).pop()

            const newRoot = targetDir + pathRequire.sep + name.split(".")[0]
            const fileID = uuidv4()
            const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
            switch (type) {
                case "png":
                case "jpg":
                case "jpeg": {
                    if (!(await NodeFS.exists(newRoot + ".pimg"))) {
                        const res = `data:image/${type};base64,` + (await FilesAPI.readFile(filePath, "base64"))
                        if (res) {
                            await NodeFS.write(newRoot + ".pimg", res)
                            const reduced = await window.imageWorker(IMAGE_WORKER_ACTIONS.RESIZE_IMAGE, {
                                image: res,
                                width: 256,
                                height: 256
                            })
                            await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + fileID + ".preview"), reduced)
                            await RegistryAPI.createRegistryEntry(fileID, newRoot.replace(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep, "") + ".pimg")
                        } else
                            alert.pushAlert("Error importing image", "error")
                    }
                    break
                }
                case "gltf":
                    result.push({
                        file: name.split(".")[0],
                        ids: await new Promise(resolve => {
                            const listenID = v4().toString()
                            ipcRenderer.once(ROUTES.IMPORT_GLTF + listenID, (ev, data) => resolve(data))
                            ipcRenderer.send(ROUTES.IMPORT_GLTF, {
                                filePath: filePath,
                                newRoot,
                                options: {},
                                projectPath: FilesAPI.path,
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


}