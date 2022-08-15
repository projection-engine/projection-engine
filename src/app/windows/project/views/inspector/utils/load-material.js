import CBStoreController from "../../../stores/CBStoreController";
import FilesAPI from "../../../../../libs/files/FilesAPI";
import Localization from "../../../../../libs/Localization";
import FALLBACK_MATERIAL from "../../../libs/engine/data/FALLBACK_MATERIAL";
import RendererStoreController from "../../../stores/RendererStoreController";
import MaterialInstance from "../../../libs/engine/libs/instances/MaterialInstance";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";

const loadFile = async (ID) => {
    const rs = await RegistryAPI.readRegistryFile(ID)
    if (rs) {
        const file = await FilesAPI.readFile(CBStoreController.ASSETS_PATH + FilesAPI.sep + rs.path, "json")
        if (file)
            return file
        else {
            alert.pushAlert(
                Localization.PROJECT.INSPECTOR.ERROR_LOADING_FILE,
                "error"
            )
            return null
        }
    }
}

export default async function loadMaterial(ID, submit) {
    try {
        const file = await loadFile(ID)
        if (!file || !file?.response){
            submit(FALLBACK_MATERIAL, "materialID")
            return
        }
        const exists = RendererStoreController.engine.materials.find(m => m.id === ID)
        if (!exists) {
            let newMat
            await new Promise(resolve => {
                newMat = new MaterialInstance({
                    id: ID,
                    onCompiled: () => resolve(),
                    settings: file.response.settings,
                    vertex: file.response.vertexShader,
                    fragment: file.response.shader,
                    uniformData: file.response.uniformData
                })
            })
            const newMaterials = [...RendererStoreController.engine.materials, newMat]
            RendererStoreController.updateEngine({...RendererStoreController.engine, materials: newMaterials})
            alert.pushAlert(Localization.PROJECT.INSPECTOR.MATERIAL_LOADED, "success")
            window.renderer.materials = newMaterials
        }
        submit(ID, "materialID")
    } catch (err) {
        console.error(err)
    }
}