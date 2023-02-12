import RegistryAPI from "./RegistryAPI";
import FilesAPI from "./FilesAPI";
import FS from "../../../shared/lib/FS/FS";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";

export default class AssetAPI {
    static async readAsset<T>(idOrPath: string): Promise<T> {
        if(!idOrPath)
            return
        const isPath = FS.resolvePath(idOrPath).includes(FS.resolvePath(FS.path))
        if (!isPath) {
            const reg = RegistryAPI.getRegistryEntry(idOrPath)
            if (reg)
                return <T>(await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + reg.path))
            return
        }
        return <T>(await FilesAPI.readFile(idOrPath))
    }


    static async writeAsset(path, fileData, previewImage?: boolean, registryID?: string) {
        const fileID = registryID !== undefined ? registryID : crypto.randomUUID()
        await FS.write(FS.resolvePath(FS.ASSETS_PATH + FS.sep + path), fileData)
        if (previewImage)
            await FS.write(FS.resolvePath(FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + FS.sep + registryID + ".preview"), previewImage)
        await RegistryAPI.createRegistryEntry(fileID, path)
    }

    static async updateAsset(registryID, fileData, previewImage?: boolean) {
        const res = RegistryAPI.getRegistryEntry(registryID)
        if (res)
            await AssetAPI.writeAsset(res.path, fileData, previewImage, registryID)
    }


}