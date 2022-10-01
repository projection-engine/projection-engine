import RegistryAPI from "../../../shared/libs/RegistryAPI";
import FilesAPI from "../../../shared/libs/FilesAPI";
import FilesStore from "../../stores/FilesStore";
import resolveFileName from "./resolve-file-name";
import FILE_TYPES from "../../../static/FILE_TYPES";
import AssetAPI from "../../../shared/libs/AssetAPI";

export default function getMaterialAsOption(m, currentDirectory){
    return {
        label: m.name,
        icon: "",
        callback: async () => {
            const nodeName = m.name
            const nodeID = m.registryID
            const regFile = await RegistryAPI.readRegistryFile(nodeID)
            if (!regFile) {
                alert.pushAlert("Material not found", "error")
                return
            }
            const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + regFile.path, "json")

            if (!file?.response)
                alert.pushAlert("Material not compiled", "error")
            else {
                let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + nodeName + "-instance", FILE_TYPES.MATERIAL_INSTANCE)

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