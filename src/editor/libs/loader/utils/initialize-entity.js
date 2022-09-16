import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";
import {Entity, FALLBACK_MATERIAL} from "../../../../../public/engine/production";


export default function initializeEntity(data, meshID, parent, index=0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index
    if (parent != null) {
        entity.parent = parent
        parent.children.push(entity)
    }
    entity.scaling = data.scaling
    entity.rotationQuaternion = data.rotationQuaternion
    entity.translation = data.translation
    entity.baseTransformationMatrix = data.baseTransformationMatrix
    if (data.pivotPoint)
        entity.pivotPoint = data.pivotPoint

    const e = entity.addComponent(COMPONENTS.MESH)
    e.materialID = FALLBACK_MATERIAL
    e.meshID = meshID


    return entity
}