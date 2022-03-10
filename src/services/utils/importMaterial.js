import MaterialInstance from "../engine/instances/MaterialInstance";
import EVENTS from "./misc/EVENTS";

export default function importMaterial(mat, engine, load) {
    const newMat = new MaterialInstance(
        engine.gpu,
        mat.id
    )

    let found = engine.materials?.find(m =>m  !== undefined &&  m.id === mat.id)
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
            if(engine.setMaterials)
                engine.setMaterials(prev => {
                    return [...prev, newMat]
                })

            load.finishEvent(EVENTS.LOADING_MATERIAL)
        })
    }

}