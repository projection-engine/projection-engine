import MaterialInstance from "../engine/renderer/elements/MaterialInstance";
import EVENTS from "./misc/EVENTS";
import cloneClass from "./misc/cloneClass";

export default function importMaterial(mat, engine, load, meshID) {
    const newMat = new MaterialInstance(
        engine.gpu,
        mat.id
    )

    let found = engine.materials.find(m => m.id === mat.id)
    if (!found) {
        load.pushEvent(EVENTS.LOADING_MATERIAL)
        newMat.initializeTextures(
            mat.blob.albedo,
            mat.blob.metallic,
            mat.blob.roughness,
            mat.blob.normal,
            mat.blob.height,
            mat.blob.ao,
        ).then(() => {
            engine.setMaterials(prev => {
                return [...prev, newMat]
            })
            engine.setMeshes(prev => {
                return prev.map(p => {
                    if (p.id === meshID) {
                        const clone = cloneClass(p)
                        clone.material = mat.id

                        return clone
                    } else
                        return p
                })
            })
            load.finishEvent(EVENTS.LOADING_MATERIAL)
        })
    } else {
        engine.setMeshes(prev => {
            return prev.map(p => {
                if (p.id === meshID) {
                    const clone = cloneClass(p)
                    clone.material = mat.id

                    return clone
                } else
                    return p
            })
        })
    }

}