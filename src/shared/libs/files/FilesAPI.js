import {v4} from "uuid"
import NodeFS from "../NodeFS"
import FilesStore from "../../../editor/stores/FilesStore";
import RegistryAPI from "./RegistryAPI";
import REG_PATH from "../../../static/REG_PATH"
import ROUTES from "../../../static/ROUTES";

const pathRequire = window.require("path")

const {ipcRenderer} = window.require("electron")
export default class FilesAPI {
    static sep = pathRequire.sep
    static registry = []

    static get path() {
        return (localStorage.getItem("basePath") + "projects" + FilesAPI.sep + sessionStorage.getItem("electronWindowID"))
    }

    static get temp() {
        return localStorage.getItem("basePath") + "temp"
    }

    static initializeFolders() {
        new Promise(async resolve => {
            await NodeFS.mkdir(FilesAPI.temp)
            if (!await NodeFS.exists(FilesAPI.path + FilesAPI.sep + "previews")) await NodeFS.mkdir(FilesAPI.path + FilesAPI.sep + "previews")
            if (!await NodeFS.exists(FilesAPI.path + FilesAPI.sep + "assets")) await NodeFS.mkdir(FilesAPI.path + FilesAPI.sep + "assets")
            if (!await NodeFS.exists(FilesAPI.path + FilesAPI.sep + REG_PATH)) await NodeFS.mkdir(FilesAPI.path + FilesAPI.sep + REG_PATH)
            if (!await NodeFS.exists(FilesAPI.path + FilesAPI.sep + "logic")) await NodeFS.mkdir(FilesAPI.path + FilesAPI.sep + "logic")
            resolve()
        }).catch(err => console.error(err))
    }

    static async writeFile(pathName, data, absolute) {
        const result = await NodeFS.write(FilesAPI.resolvePath(!absolute ? FilesAPI.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)

        if (result[0])
            throw Error(result[0])
    }

    static async readFile(pathName, type) {
        return await new Promise(resolve => {
            const listenID = v4().toString()
            ipcRenderer.once(ROUTES.READ_FILE + listenID, (ev, data) => resolve(data))
            ipcRenderer.send(ROUTES.READ_FILE, {pathName, type, listenID})
        })
    }


    static async deleteFile(pathName, options) {
        const currentPath = FilesAPI.resolvePath(pathName)

        for (let i = 0; i < FilesAPI.registry.length; i++) {
            const r = FilesAPI.registry[i]
            const rPath = FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + r.path)
            if (rPath.includes(currentPath))
                await NodeFS.rm(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH + FilesAPI.sep + r.id + ".reg"))
        }
        await NodeFS.rm(currentPath, options)

        const rs = await RegistryAPI.findRegistry(currentPath)
        if (rs) await NodeFS.rm(FilesAPI.resolvePath(FilesAPI.path + FilesAPI.sep + REG_PATH + FilesAPI.sep + rs.id + ".reg"))
    }

    static resolvePath(path) {
        return pathRequire.resolve(path)
    }
}


