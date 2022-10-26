import GPUResources from "../../../../public/engine/GPUResources";
import MaterialAPI from "../../../../public/engine/api/rendering/MaterialAPI";
import AssetAPI from "../../../libs/AssetAPI";
import Localization from "../../../templates/LOCALIZATION_EN";
import GPUController from "../../../../public/engine/GPUController";

export default async function updateMaterialAsset(key, value, registryID, temp, setTemp, original, doUpdate=true) {
    let valid = false
    const old = temp.uniformData
    if(original != null) {
        if (!old.find(u => u.key === key) && original.uniformData.find(u => u.key === key))
            old.push(original.uniformData.find(u => u.key === key))
    }
    const newData = {
        ...temp, uniformData: old.map(u => {
            if (u.key === key && JSON.stringify(value) !== JSON.stringify(u.data)) {
                valid = true
                return {...u, data: value}
            }
            return u
        })
    }
    setTemp(newData)
    if (!valid)
        return
    const instance = GPUResources.materials.get(registryID)
    if (instance != null && doUpdate) {
        await MaterialAPI.updateMaterialUniforms(newData.uniformData, instance)
        alert.pushAlert(Localization.MATERIAL_UPDATED, "success")
        GPUController.cleanUpTextures()
    }
    alert.pushAlert(Localization.UPDATING_ASSET, "alert")
    await AssetAPI.updateAsset(registryID, JSON.stringify(newData))

}