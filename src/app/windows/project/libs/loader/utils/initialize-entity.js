import Entity from "../../engine/production/templates/basic/Entity";
import TransformComponent from "../../engine/production/templates/components/TransformComponent";
import COMPONENTS from "../../engine/production/data/COMPONENTS";
import MeshComponent from "../../engine/production/templates/components/MeshComponent";
import FALLBACK_MATERIAL from "../../engine/production/data/FALLBACK_MATERIAL";

export default function initializeEntity(data, meshID, parent, index=0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index
    if (parent && parent instanceof Entity) {
        entity.parent = parent
        parent.children.push(entity)
    }
    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotationQuat = data.rotationQuat
    transformation.translation = data.translation
    transformation.baseTransformationMatrix = data.baseTransformationMatrix
    if (data.pivotPoint)
        transformation.pivotPoint = data.pivotPoint

    entity.components[COMPONENTS.MESH] = new MeshComponent()
    entity.components[COMPONENTS.MESH].materialID = FALLBACK_MATERIAL
    entity.components[COMPONENTS.MESH].meshID = meshID
    entity.components[COMPONENTS.TRANSFORM] = transformation

    return entity
}