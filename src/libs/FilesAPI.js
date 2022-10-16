import {v4} from "uuid"
import NodeFS from "shared-resources/frontend/libs/NodeFS"
import RegistryAPI from "./RegistryAPI";
import ROUTES from "../data/ROUTES";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";

const pathRequire = window.require("path")

const {ipcRenderer} = window.require("electron")
export default class FilesAPI {
    static sep = pathRequire.sep
    static registry = []

    static initializeFolders() {
        new Promise(async resolve => {
            await NodeFS.mkdir(NodeFS.temp)
            if (!await NodeFS.exists(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)) await NodeFS.mkdir(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)
            if (!await NodeFS.exists(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)) await NodeFS.mkdir(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
            if (!await NodeFS.exists(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)) await NodeFS.mkdir(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)

            resolve()
        }).catch(err => console.error(err))
    }

    static async writeFile(pathName, data, absolute) {
        await NodeFS.write(NodeFS.resolvePath(!absolute ? NodeFS.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
    }

    static async readFile(pathName, type) {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once(ROUTES.READ_FILE + listenID, (ev, data) => resolve(data))
            ipcRenderer.send(ROUTES.READ_FILE, {pathName, type, listenID})
        })
    }


    static async deleteFile(pathName, options) {
        const currentPath = NodeFS.resolvePath(pathName)

        for (let i = 0; i < FilesAPI.registry.length; i++) {
            const r = FilesAPI.registry[i]
            const rPath = NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + r.path)
            if (rPath.includes(currentPath))
                await NodeFS.rm(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + NodeFS.sep + r.id + ".reg"))
        }
        await NodeFS.rm(currentPath, options)

        const rs = await RegistryAPI.findRegistry(currentPath)
        if (rs) await NodeFS.rm(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + NodeFS.sep + rs.id + ".reg"))
    }


}


