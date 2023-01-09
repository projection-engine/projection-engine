import RegistryAPI from "./RegistryAPI";
import ROUTES from "../../../../../backend/static/ROUTES";
import FS from "../../../../lib/FS/FS";
import PROJECT_FOLDER_STRUCTURE from "../../../../../static/objects/PROJECT_FOLDER_STRUCTURE";

const pathRequire = window.require("path")
const {ipcRenderer} = window.require("electron")

export default class FilesAPI {
    static sep = pathRequire.sep
    static registry = []

    static async initializeFolders(): Promise<void> {
        await FS.mkdir(FS.TEMP)
        if (FS.exists(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)) await FS.mkdir(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)
        if (FS.exists(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)) await FS.mkdir(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        if (FS.exists(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)) await FS.mkdir(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)
    }

    static async writeFile(pathName: string, data: any, absolute: boolean) {
        try {
            await FS.write(FS.resolvePath(!absolute ? FS.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
        } catch (err) {
            console.error(err)
        }
    }

    static readFile(pathName: string, type?: string): Promise<any> {
        return new Promise(resolve => {
            const listenID =crypto.randomUUID()
            ipcRenderer.once(ROUTES.READ_FILE + listenID, (ev, data) => resolve(data))
            ipcRenderer.send(ROUTES.READ_FILE, {pathName, type, listenID})
        })
    }


    static async deleteFile(pathName, options) {
        const currentPath = FS.resolvePath(pathName)

        for (let i = 0; i < FilesAPI.registry.length; i++) {
            const r = FilesAPI.registry[i]
            const rPath = FS.resolvePath(FS.ASSETS_PATH + FS.sep + r.path)
            if (rPath.includes(currentPath))
                await FS.rm(FS.resolvePath(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + FS.sep + r.id + ".reg"))
        }
        await FS.rm(currentPath, options)

        const rs = await RegistryAPI.findRegistry(currentPath)
        if (rs) await FS.rm(FS.resolvePath(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + FS.sep + rs.id + ".reg"))
    }


}


