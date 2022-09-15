import FilesStore from "../../../stores/FilesStore";
import FilesAPI from "../../../../shared/libs/files/FilesAPI";
import Localization from "../../../../shared/libs/Localization";
import FALLBACK_MATERIAL from "../../../../../public/engine/static/FALLBACK_MATERIAL";
import RegistryAPI from "../../../../shared/libs/files/RegistryAPI";
import GPU from "../../../../../public/engine/production/GPU";
import FILE_TYPES from "../../../../static/FILE_TYPES";

const loadFile = async (rs) => {

    const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path, "json")
    if (!file)
        alert.pushAlert(
            Localization.PROJECT.INSPECTOR.ERROR_LOADING_FILE,
            "error"
        )
    return file
}

export default async function loadMaterial(ID, submit) {
    if (ID === FALLBACK_MATERIAL)
        submit(FALLBACK_MATERIAL, "materialID")
    else
        try {
            const reg = await RegistryAPI.readRegistryFile(ID)
            if (!reg)
                return
            const isInstance = reg.path.includes(FILE_TYPES.MATERIAL_INSTANCE)

            if (!GPU.materials.get(ID)) {
                alert.pushAlert(Localization.PROJECT.INSPECTOR.LOADING_MATERIAL, "alert")

                const file = await loadFile(reg)

                if (!file || isInstance && !file.original || !isInstance && !file.response) {
                    alert.pushAlert("Please, check if material was compiled correctly")
                    return
                }
                if (isInstance) {
                    if (!GPU.materials.get(file.original))
                        await loadMaterial(file.original, () => null)
                    await GPU.allocateMaterialInstance(file, ID)

                }
                else {
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
            }
            submit(ID, "materialID")
        } catch (err) {
            console.error(err)
        }
}