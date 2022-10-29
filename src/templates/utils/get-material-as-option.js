import RegistryAPI from "../../libs/RegistryAPI";
import FilesAPI from "../../libs/FilesAPI";
import FilesStore from "../../stores/FilesStore";
import resolveFileName from "./resolve-file-name";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import AssetAPI from "../../libs/AssetAPI";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default function getMaterialAsOption(m, currentDirectory){
    return {
        label: m.name,
        callback: async () => {
            const nodeName = m.name
            const nodeID = m.registryID
            const regFile = RegistryAPI.getRegistryEntry(nodeID)
            if (!regFile) {
                alert.pushAlert("Material not found", "error")
                return
            }
            const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + regFile.path, "json")

            if (!file?.response)
                alert.pushAlert("Material not compiled", "error")
            else {
                let path = await resolveFileName(currentDirectory.id + NodeFS.sep + nodeName + "-instance", FILE_TYPES.MATERIAL_INSTANCE)

                await AssetAPI.writeAsset(path, JSON.stringify({
                    original: nodeID,
                    uniforms: file.response.uniforms,
                    uniformData: file.response.uniformData
                }))
                await FilesStore.refreshFiles()
            }
        }
    }
}