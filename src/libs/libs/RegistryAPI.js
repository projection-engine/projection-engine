import {v4 as uuidv4} from "uuid";
import NodeFS, {getCall} from "shared-resources/frontend/libs/NodeFS"
import FilesAPI from "./FilesAPI";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const {ipcRenderer} = window.require("electron")
const fs = window.require("fs")

export default class RegistryAPI {
    static registry = []

    static async readRegistry() {
        const registry = await getCall("read-registry", {}, false)

        const response = {}
        const entriesToRemove = []
        for (let i = 0; i < registry.length; i++) {
            const current = registry[i]
            const pathToFind = NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + current.path)

            if (!fs.existsSync(pathToFind))
                entriesToRemove.push(current.registryPath)
            else {
                if (response[current.path])
                    entriesToRemove.push(response[current.path].registryPath)
                response[current.path] = current
            }
        }
        ipcRenderer.send("remove-registry", entriesToRemove)
        RegistryAPI.registry = Object.values(response)
        return Object.values(response)
    }

    static async updateRegistry(from, to, registryData) {
        const assetsResolved = NodeFS.resolvePath(NodeFS.ASSETS_PATH)
        const fromResolved = NodeFS.resolvePath(from).replace(assetsResolved, "")
        const toResolved = NodeFS.resolvePath(to)
        const registryFound = registryData.find(reg => {
            const regResolved = NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path).replace(assetsResolved, "")
            return regResolved === fromResolved
        })
        if (registryFound) await NodeFS.write(registryFound.registryPath, JSON.stringify({
            id: registryFound.id, path: toResolved.replace(assetsResolved, "")
        }))
    }

    static async createRegistryEntry(fID = uuidv4(), pathToFile) {
        await getCall("create-registry", {id: fID, path: pathToFile}, false)
    }

    static async readRegistryFile(id) {
        try {
            return await FilesAPI.readFile(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + NodeFS.sep + id + FILE_TYPES.REGISTRY), "json")
        } catch (e) {
            return null
        }
    }

    static async findRegistry(p) {
        const res = await NodeFS.readdir(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.readRegistryFile(data.replace(FILE_TYPES.REGISTRY, ""))))
            const parsedPath = NodeFS.resolvePath(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}