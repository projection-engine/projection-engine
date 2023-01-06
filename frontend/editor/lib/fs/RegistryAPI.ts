import {v4 as uuidv4} from "uuid";
import FS from "../../../lib/FS/FS";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import FILE_TYPES from "../../../../static/objects/FILE_TYPES";
import {getCall} from "../../../lib/FS/get-call";
import RegistryFile from "../../../../static/objects/RegistryFile";
import ROUTES from "../../../../backend/static/ROUTES";


const {ipcRenderer} = window.require("electron")
export default class RegistryAPI {
    static registry: { [key: string]: RegistryFile } = {}

    static async readRegistry():Promise<RegistryFile[]> {
        const registry = await getCall<{ [key: string]: RegistryFile }>(ROUTES.READ_REGISTRY, {}, false)
        RegistryAPI.registry = registry
        return Object.values(registry)
    }

    static async updateRegistry(from, to) {

        const fromResolved = FS.resolvePath(from).replace(FS.ASSETS_PATH, "")
        const toResolved = FS.resolvePath(to).replace(FS.ASSETS_PATH, "")
        const registryFound = Object.values(RegistryAPI.registry).find(reg => {
            const regResolved = FS.resolvePath(FS.ASSETS_PATH + FS.sep + reg.path).replace(FS.ASSETS_PATH, "")
            return regResolved === fromResolved
        })
        if (registryFound) {
            registryFound.path = toResolved
            ipcRenderer.send(ROUTES.UPDATE_REG, {id: registryFound.id, data: registryFound})
        }
    }

    static async createRegistryEntry(fID = uuidv4(), pathToFile) {
        await getCall<undefined>(ROUTES.CREATE_REG, {id: fID, path: pathToFile}, false)
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
        const res = await FS.readdir(FS.resolvePath(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY))
        if (res) {
            const registryData = await Promise.all(res.map(data => RegistryAPI.getRegistryEntry(data.replace(FILE_TYPES.REGISTRY, ""))))
            const parsedPath = FS.resolvePath(p)
            return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
        }
    }

}