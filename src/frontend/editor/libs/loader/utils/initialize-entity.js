import Entity from "../../../../../../public/engine/production/instances/entity/Entity";
import COMPONENTS from "../../../../../../public/engine/production/data/COMPONENTS";
import FALLBACK_MATERIAL from "../../../../../../public/engine/production/data/FALLBACK_MATERIAL";

export default function initializeEntity(data, meshID, parent, index=0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index
    if (parent && parent instanceof Entity) {
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