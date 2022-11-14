import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js";
import Entity from "../../../../public/engine/instances/Entity";


export default function initializeEntity(data, meshID, parent, index = 0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index

    try {
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

        for (let i = 0; i < 16; i++)
            entity.baseTransformationMatrix[i] = data.baseTransformationMatrix[i]

        entity.pivotPoint[0] = entity.baseTransformationMatrix[12]
        entity.pivotPoint[1] = entity.baseTransformationMatrix[13]
        entity.pivotPoint[2] = entity.baseTransformationMatrix[14]

        const e = entity.addComponent(COMPONENTS.MESH)
        e.materialID = data.material
        e.meshID = meshID
        return entity
    } catch (err) {
        console.error(err)
    }
}