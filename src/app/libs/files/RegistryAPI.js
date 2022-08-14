import {v4 as uuidv4, v4} from "uuid";
import NodeFS from "../NodeFS";
import FilesAPI from "./FilesAPI";

const pathRequire = window.require("path")
const {ipcRenderer} = window.require("electron")

export default class RegistryAPI {
    static registry = []

    static async readRegistry() {
        const promise = await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once("read-registry-" + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send("read-registry", {
                pathName: FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assetsRegistry"),
                listenID
            })
        })
        RegistryAPI.registry = promise
        return promise
    }

    static async updateRegistry(from, to, registryData) {
        const assetsResolved = pathRequire.resolve(FilesAPI.path + FilesAPI.sep + "assets")
        const fromResolved = pathRequire.resolve(from).replace(assetsResolved, "")
        const toResolved = pathRequire.resolve(to)
        const registryFound = registryData.find(reg => {
            const regResolved = pathRequire.resolve(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + reg.path).replace(assetsResolved, "")
            return regResolved === fromResolved
        })
        if (registryFound) await NodeFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, "")
        }))
    }

    static async createRegistryEntry(fID = uuidv4(), path) {
        const pathRe = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets")
        const p = FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + path).replace(pathRe, "")
        await NodeFS.write(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assetsRegistry" + FilesAPI.sep + fID + ".reg"), JSON.stringify({
            id: fID, path: p
        }))
    }

    static async readRegistryFile(id) {
        try {
            return await FilesAPI.readFile(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assetsRegistry" + FilesAPI.sep + id + ".reg"), "json")
        } catch (e) {
            return null
        }
    }

    static async findRegistry(p) {
        const [, res] = await NodeFS.readdir(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + "assetsRegistry"))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.readRegistryFile(data.replace(".reg", ""))))
            const parsedPath = pathRequire.resolve(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}