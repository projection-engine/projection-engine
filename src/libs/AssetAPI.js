import NodeFS from "shared-resources/frontend/libs/NodeFS"
import {v4} from "uuid";
import RegistryAPI from "./RegistryAPI";
import FilesAPI from "./FilesAPI";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";

const fs = window.require("fs")

export default class AssetAPI {
    static async readAsset(id) {
        const reg = RegistryAPI.getRegistryEntry(id)
        if (reg)
            return await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path)
    }


    static async writeAsset(path, fileData, previewImage, registryID) {
        const fileID = registryID !== undefined ? registryID : v4()
        await NodeFS.write(NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + path), fileData)
        if (previewImage)
            await NodeFS.write(NodeFS.resolvePath(NodeFS.path + NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + registryID + ".preview"), previewImage)
        await RegistryAPI.createRegistryEntry(fileID, path)
    }

    static readMetadata(fileID) {
        const reg = RegistryAPI.getRegistryEntry(fileID)
        if (!reg)
            return null
        try {
            const path = NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path)
            return {
                ...reg,
                path,
                type: reg.path.split(".").pop(),
                stat: fs.statSync(path)
            }
        } catch (err) {
            return null
        }
    }

    static async updateAsset(registryID, fileData, previewImage) {
        const res = RegistryAPI.getRegistryEntry(registryID)
        if (res)
            await AssetAPI.writeAsset(res.path, fileData, previewImage, registryID)
    }


}