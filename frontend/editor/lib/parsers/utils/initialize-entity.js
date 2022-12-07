import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.js";
import Entity from "../../../../../public/engine/instances/Entity";


export default function initializeEntity(data, meshID, parent, index = 0) {
    const entity = new Entity()
    entity.name = data.name ? data.name : "primitive-" + index

    try {
        if (parent != null) {
            entity.parent = parent
            parent.children.push(entity)
        }
        entity.changed = true

        for (let i = 0; i < 16; i++)
            entity.baseTransformationMatrix[i] = data.baseTransformationMatrix[i]

        const e = entity.addComponent(COMPONENTS.MESH)
        e.materialID = data.material
        e.meshID = meshID
        return entity
    } catch (err) {
        console.error(err)
    }
}