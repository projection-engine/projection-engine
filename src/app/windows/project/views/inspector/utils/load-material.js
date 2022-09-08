import FilesStore from "../../../stores/FilesStore";
import FilesAPI from "../../../../../libs/files/FilesAPI";
import Localization from "../../../../../libs/Localization";
import FALLBACK_MATERIAL from "../../../libs/engine/production/data/FALLBACK_MATERIAL";
import EngineStore from "../../../stores/EngineStore";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";
import GPU from "../../../libs/engine/production/controllers/GPU";

const loadFile = async (ID) => {
    const rs = await RegistryAPI.readRegistryFile(ID)
    if (rs) {
        const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path, "json")
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
    if (ID === FALLBACK_MATERIAL)
        submit(FALLBACK_MATERIAL, "materialID")
    else
        try {
            const file = await loadFile(ID)
            if (!file || !file?.response) {
                alert.pushAlert("Please, check if material was compiled correctly")
                return
            }
            const exists = EngineStore.engine.materials.find(m => m.id === ID)
            if (!exists) {
                let newMat
                await new Promise(resolve => {
                    newMat = GPU.allocateMaterial({
                        onCompiled: () => resolve(),
                        settings: file.response.settings,
                        vertex: file.response.vertexShader,
                        fragment: file.response.shader,
                        uniformData: file.response.uniformData
                    }, ID)
                })
                const newMaterials = [...EngineStore.engine.materials, newMat]
                EngineStore.updateStore({...EngineStore.engine, materials: newMaterials})
                alert.pushAlert(Localization.PROJECT.INSPECTOR.MATERIAL_LOADED, "success")
                window.renderer.materials = newMaterials
            }
            submit(ID, "materialID")
        } catch (err) {
            console.error(err)
        }
}