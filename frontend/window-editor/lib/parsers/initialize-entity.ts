import COMPONENTS from "../../../../engine-core/static/COMPONENTS"
import Entity from "../../../../engine-core/instances/Entity"
import MeshComponent from "../../../../engine-core/instances/components/MeshComponent"
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI"


export default function initializeEntity(data: MutableObject, meshID: string, parent?: Entity, index?: number) {
	const entity = EntityAPI.getNewEntityInstance(data?.id)
	entity.name = data.name ? data.name : "primitive-" + (index || 0)
	try {
		entity.addParent(parent)
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