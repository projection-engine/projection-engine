import COMPONENTS from "../../../../public/engine/static/COMPONENTS.json";
import {Entity, FALLBACK_MATERIAL, GPU} from "../../../../public/engine/production";


export default function initializeEntity(data, meshID, parent, index=0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index
    if (parent != null) {
        entity.parent = parent
        parent.children.push(entity)
    }
    entity._scaling[0] = data.scaling[0]
    entity._scaling[1] = data.scaling[1]
    entity._scaling[2] = data.scaling[2]

    entity._translation[0] = data.translation[0]
    entity._translation[1] = data.translation[1]
    entity._translation[2] = data.translation[2]


    entity._rotationQuat[0] = data._rotationQuat[0]
    entity._rotationQuat[1] = data._rotationQuat[1]
    entity._rotationQuat[2] = data._rotationQuat[2]
    entity._rotationQuat[3] = data._rotationQuat[3]
    entity.changed = true

    entity.baseTransformationMatrix = data.baseTransformationMatrix
    if (data.pivotPoint)
        entity.pivotPoint = data.pivotPoint

    const e = entity.addComponent(COMPONENTS.MESH)
    e.materialID = GPU.materials.get(data.material) != null ? data.material : FALLBACK_MATERIAL
    e.meshID = meshID


    return entity
}