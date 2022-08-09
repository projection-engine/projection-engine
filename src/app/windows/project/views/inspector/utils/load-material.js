import FileStoreController from "../../../stores/FileStoreController";
import FileSystem from "../../../../../libs/FileSystem";
import Localization from "../../../../../libs/Localization";
import FALLBACK_MATERIAL from "../../../libs/engine/data/FALLBACK_MATERIAL";
import DataStoreController from "../../../stores/DataStoreController";
import MaterialInstance from "../../../libs/engine/libs/instances/MaterialInstance";

const loadFile = async (ID) => {
    const rs = await window.fileSystem.readRegistryFile(ID)
    if (rs) {
        const file = await window.fileSystem.readFile(FileStoreController.ASSETS_PATH + FileSystem.sep + rs.path, "json")
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
        const exists = DataStoreController.engine.materials.find(m => m.id === ID)
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
            const newMaterials = [...DataStoreController.engine.materials, newMat]
            DataStoreController.updateEngine({...DataStoreController.engine, materials: newMaterials})
            alert.pushAlert(Localization.PROJECT.INSPECTOR.MATERIAL_LOADED, "success")
            window.renderer.materials = newMaterials
        }
        submit(ID, "materialID")
    } catch (err) {
        console.error(err)
    }
}