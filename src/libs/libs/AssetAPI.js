import NodeFS from "shared-resources/frontend/libs/NodeFS"
import {v4 as uuidv4} from "uuid";
import RegistryAPI from "./RegistryAPI";
import FilesAPI from "./FilesAPI";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";

export default class AssetAPI {
    static async readAsset(id) {
        const reg = await RegistryAPI.readRegistryFile(id)
        if(reg)
            return await FilesAPI.readFile(NodeFS.ASSETS_PATH  + NodeFS.sep + reg.path)
    }

    static async assetExists(path) {
        return await NodeFS.exists(NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + path))
    }

    static async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : uuidv4()
        await NodeFS.write(NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + path), fileData)
        if (previewImage)
            await NodeFS.write(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + registryID + ".preview"), previewImage)
        await RegistryAPI.createRegistryEntry(fileID, path)
    }


    static async updateAsset(registryID, fileData, previewImage) {
        const res = await RegistryAPI.readRegistryFile(registryID)
        if (res)
            await AssetAPI.writeAsset(res.path, fileData, previewImage, registryID)
        else
            throw Error("Not found")
    }




}