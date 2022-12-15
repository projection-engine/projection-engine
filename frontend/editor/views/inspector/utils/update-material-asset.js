import GPU from "../../../../../engine-core/GPU";
import MaterialAPI from "../../../../../engine-core/lib/rendering/MaterialAPI";
import AssetAPI from "../../../lib/fs/AssetAPI";
import GPUAPI from "../../../../../engine-core/lib/rendering/GPUAPI";

export default async function updateMaterialAsset(key, value, registryID, temp, setTemp, original, doUpdate=true) {
    let valid = key === undefined
    const old = temp.uniformValues

    if(original != null) {
        if (!old.find(u => u.key === key) && original.uniformValues.find(u => u.key === key))
            old.push(original.uniformValues.find(u => u.key === key))
    }
    const newData = {
        ...temp, uniformValues: old.map(u => {
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
    const instance = GPU.materials.get(registryID)
    if (instance != null && doUpdate) {
        await MaterialAPI.updateMaterialUniforms(newData.uniformValues, instance)

        GPUAPI.cleanUpTextures()
    }

    await AssetAPI.updateAsset(registryID, JSON.stringify(newData))

}