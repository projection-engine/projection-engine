import COMPONENTS from "../../../../../engine-core/static/COMPONENTS";
import Entity from "../../../../../engine-core/instances/Entity";
import MutableObject from "../../../../../engine-core/MutableObject";
import MeshComponent from "../../../../../engine-core/instances/components/MeshComponent";


export default function initializeEntity(data: MutableObject, meshID: string, parent?: Entity, index?: number) {
    const entity = new Entity(data?.id, data.name ? data.name : "primitive-" + (index || 0))
    try {
        if (parent != null) {
            entity.parent = parent
            parent.children.push(entity)
        }
        entity.changed = true

        for (let i = 0; i < 16; i++)
            entity.baseTransformationMatrix[i] = data.baseTransformationMatrix[i]

        const comp = <MeshComponent>entity.addComponent(COMPONENTS.MESH)
        entity.addComponent(COMPONENTS.CULLING)
        comp.materialID = data.material
        comp.meshID = meshID
        return entity
    } catch (err) {
        console.error(err)
    }
}