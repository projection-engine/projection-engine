import {v4 as uuidv4, v4} from "uuid";
import NodeFS from "shared-resources/frontend/libs/NodeFS"
import FilesAPI from "./FilesAPI";
import ROUTES from "../../static/ROUTES";
import PROJECT_FOLDER_STRUCTURE from "../../static/PROJECT_FOLDER_STRUCTURE";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const {ipcRenderer} = window.require("electron")
const fs = window.require("fs")

export default class RegistryAPI {
    static registry = []

    static async readRegistry() {
        const registryPath = FilesAPI.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)
        const promise = await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once(ROUTES.READ_REGISTRY + listenID, (ev, data) => {
                resolve(data)
            })
            ipcRenderer.send(ROUTES.READ_REGISTRY, {
                pathName: registryPath,
                listenID
            })
        })

        const response = {}
        for(let i = 0; i < promise.length; i++){
            const current = promise[i]
            const pathToFind = FilesAPI.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + current.path)

            if(!fs.existsSync(pathToFind))
                await FilesAPI.deleteFile(current.registryPath)
            else {
                // REPEATED REGISTRY ENTRY
                if(response[current.path])
                    await FilesAPI.deleteFile(response[current.path].registryPath)
                response[current.path] = current
            }
        }
        RegistryAPI.registry = Object.values(response)
        return Object.values(response)
    }

    static async updateRegistry(from, to, registryData) {
        const assetsResolved = FilesAPI.resolvePath(NodeFS.ASSETS_PATH)
        const fromResolved = FilesAPI.resolvePath(from).replace(assetsResolved, "")
        const toResolved = FilesAPI.resolvePath(to)
        const registryFound = registryData.find(reg => {
            const regResolved = FilesAPI.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path).replace(assetsResolved, "")
            return regResolved === fromResolved
        })
        if (registryFound) await NodeFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, "")
        }))
    }

    static async createRegistryEntry(fID = uuidv4(), path) {
        const pathRe = FilesAPI.resolvePath(NodeFS.ASSETS_PATH)
        const p = FilesAPI.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + path).replace(pathRe, "")
        await NodeFS.write(FilesAPI.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + NodeFS.sep + fID + FILE_TYPES.REGISTRY), JSON.stringify({
            id: fID, path: p
        }))
    }

    static async readRegistryFile(id) {
        try {
            return await FilesAPI.readFile(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + NodeFS.sep + id + FILE_TYPES.REGISTRY), "json")
        } catch (e) {
            return null
        }
    }

    static async findRegistry(p) {
        const [, res] = await NodeFS.readdir(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.readRegistryFile(data.replace(FILE_TYPES.REGISTRY, ""))))
            const parsedPath = NodeFS.resolvePath(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}