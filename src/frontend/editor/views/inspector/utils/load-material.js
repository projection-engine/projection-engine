import FilesStore from "../../../stores/FilesStore";
import FilesAPI from "../../../../shared/libs/files/FilesAPI";
import Localization from "../../../../shared/libs/Localization";
import FALLBACK_MATERIAL from "../../../../../../public/engine/static/FALLBACK_MATERIAL";
import RegistryAPI from "../../../../shared/libs/files/RegistryAPI";
import GPU from "../../../../../../public/engine/production/GPU";

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
            alert.pushAlert(Localization.PROJECT.INSPECTOR.LOADING_MATERIAL, "alert")
            const file = await loadFile(ID)
            if (!file || !file?.response) {
                alert.pushAlert("Please, check if material was compiled correctly")
                return
            }
            const exists = GPU.materials.get(ID) != null
            if (!exists) {
                await new Promise(resolve => {
                    GPU.allocateMaterial({
                        onCompiled: () => resolve(),
                        settings: file.response.settings,
                        vertex: file.response.vertexShader,
                        fragment: file.response.shader,
                        uniformData: file.response.uniformData
                    }, ID)
                })
            }
            submit(ID, "materialID")
        } catch (err) {
            console.error(err)
        }
}