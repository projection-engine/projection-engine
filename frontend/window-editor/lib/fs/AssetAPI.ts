import RegistryAPI from "./RegistryAPI";
import FilesAPI from "./FilesAPI";
import FS from "../../../shared/lib/FS/FS";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import Electron from "../../../shared/lib/Electron";

export default class AssetAPI {
    static async readAsset(id) {
        const reg = RegistryAPI.getRegistryEntry(id)
        if (reg)
            return await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + reg.path)
    }


    static async writeAsset(path, fileData, previewImage?:boolean, registryID?:string) {
        const fileID = registryID !== undefined ? registryID : crypto.randomUUID()
        await FS.write(FS.resolvePath(FS.ASSETS_PATH + FS.sep + path), fileData)
        if (previewImage)
            await FS.write(FS.resolvePath(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + FS.sep + registryID + ".preview"), previewImage)
        await RegistryAPI.createRegistryEntry(fileID, path)
    }

    static readMetadata(fileID) {
        const reg = RegistryAPI.getRegistryEntry(fileID)
        if (!reg)
            return null
        try {
            const path = FS.resolvePath(FS.ASSETS_PATH + FS.sep + reg.path)
            return {
                ...reg,
                path,
                type: reg.path.split(".").pop(),
                stat: Electron.fs.statSync(path)
            }
        } catch (err) {
            return null
        }
    }

    static async updateAsset(registryID, fileData, previewImage?:boolean) {
        const res = RegistryAPI.getRegistryEntry(registryID)
        if (res)
            await AssetAPI.writeAsset(res.path, fileData, previewImage, registryID)
    }


}