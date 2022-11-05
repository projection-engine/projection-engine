import {v4 as uuidv4} from "uuid";
import NodeFS, {getCall} from "shared-resources/frontend/libs/NodeFS"
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const {ipcRenderer} = window.require("electron")
export default class RegistryAPI {
    static registry = {}

    static async readRegistry() {
        const registry = await getCall("read-registry", {}, false)
        RegistryAPI.registry = registry
        return Object.values(registry)
    }

    static async updateRegistry(from, to) {

        const fromResolved = NodeFS.resolvePath(from).replace(NodeFS.ASSETS_PATH, "")
        const toResolved = NodeFS.resolvePath(to).replace(NodeFS.ASSETS_PATH, "")
        const registryFound = Object.values(RegistryAPI.registry).find(reg => {
            const regResolved = NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path).replace(NodeFS.ASSETS_PATH, "")
            return regResolved === fromResolved
        })
        console.trace(registryFound, toResolved, fromResolved)
        if (registryFound) {
            registryFound.path = toResolved
            ipcRenderer.send("update-registry", {id: registryFound.id, data: registryFound})
        }
    }

    static async createRegistryEntry(fID = uuidv4(), pathToFile) {
        await getCall("create-registry", {id: fID, path: pathToFile}, false)
    }

    static getByPath(path) {
        const obj = Object.values(RegistryAPI.registry)
        for (let i = 0; i < obj.length; i++) {
            const c = obj[i]
            if (c.path === path)
                return c.id
        }
    }

    static getRegistryEntry(id) {
        return RegistryAPI.registry[id]
    }

    static async findRegistry(p) {
        const res = await NodeFS.readdir(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.getRegistryEntry(data.replace(FILE_TYPES.REGISTRY, ""))))
            const parsedPath = NodeFS.resolvePath(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}