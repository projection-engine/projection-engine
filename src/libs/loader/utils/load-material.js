import FilesAPI from "../../FilesAPI";
import Localization from "../../../templates/LOCALIZATION_EN";
import FALLBACK_MATERIAL from "../../../../public/engine/static/FALLBACK_MATERIAL";
import RegistryAPI from "../../RegistryAPI";
import GPUResources from "../../../../public/engine/GPUResources";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import TERRAIN_MATERIAL from "../../../../public/engine/static/TERRAIN_MATERIAL";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import GPUController from "../../../../public/engine/GPUController";

const loadFile = async (rs) => {

    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + NodeFS.sep + rs.path, "json")
    if (!file)
        alert.pushAlert(
            Localization.ERROR_LOADING_FILE,
            "error"
        )
    return file
}

export default async function loadMaterial(ID, submit) {
    if (ID === FALLBACK_MATERIAL || !ID)
        submit(FALLBACK_MATERIAL, "materialID")
    else if (ID.includes(TERRAIN_MATERIAL))
        submit(ID, "materialID")
    else if(GPUResources.materials.get(ID) != null)
        submit(ID, "materialID")
    else
        try {
            const reg = await RegistryAPI.readRegistryFile(ID)
            if (!reg)
                return
            const isInstance = reg.path.includes(FILE_TYPES.TERRAIN_MATERIAL) || reg.path.includes(FILE_TYPES.MATERIAL_INSTANCE) || reg.path.includes(FILE_TYPES.SIMPLE_MATERIAL)
            if (!GPUResources.materials.get(ID)) {
                alert.pushAlert(Localization.LOADING_MATERIAL, "alert")
                const file = await loadFile(reg)
                if (!file || isInstance && !file.original || !isInstance && !file.response) {
                    alert.pushAlert("Please, check if material was compiled correctly")
                    return
                }
                if (isInstance) {
                    if (!GPUResources.materials.get(file.original))
                        await loadMaterial(file.original, () => null)
                    await GPUController.allocateMaterialInstance(file, ID)

                } else {
                    await new Promise(resolve => {
                        GPUController.allocateMaterial({
                            onCompiled: () => resolve(),
                            settings: file.response.settings,
                            vertex: file.response.vertexShader,
                            fragment: file.response.shader,
                            uniformData: file.response.uniformData
                        }, ID)
                    })
                }
            }
            submit(ID, "materialID")
        } catch (err) {
            console.error(err)
            submit(FALLBACK_MATERIAL, "materialID")
        }
}