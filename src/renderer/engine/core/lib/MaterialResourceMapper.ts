import Material from "../instances/Material"
import EditorEntity from "../../tools/EditorEntity"
import GPU from "../GPU"
import ResourceMapper from "./ResourceMapper"


type Resource = { material: Material, entities: EditorEntity[], entitiesMap: Map<string, EditorEntity> }[]
export default class MaterialResourceMapper {
	static #mapper = new ResourceMapper("material")

	static get materialsArray(): Resource {
		return <Resource>MaterialResourceMapper.#mapper.dataMap
	}

	static removeBlock(entities: EditorEntity[]) {
		MaterialResourceMapper.#mapper.removeBlock(entities)
	}

	static unlinkEntityMaterial(entityID: string) {
		MaterialResourceMapper.#mapper.unlink(entityID)
	}

	static deleteMaterial(meshID: string) {
		const oldRef = this.#mapper.delete(meshID)
		oldRef.forEach(e => {
			e.meshComponent.materialID = undefined
		})
	}

	static linkEntityMaterial(entity: EditorEntity, materialID: string) {
		let index = MaterialResourceMapper.materialsArray.findIndex(m => m.material.id === materialID)
		if (index < 0 && !GPU.materials.has(materialID))
			return
		if (index < 0) {
			MaterialResourceMapper.materialsArray.push({
				material: GPU.materials.get(materialID),
				entitiesMap: new Map(),
				entities: []
			})
			index = MaterialResourceMapper.materialsArray.length - 1
		}
		const instance = MaterialResourceMapper.materialsArray[index]
		if (instance.entitiesMap.has(entity.id))
			return
		instance.entities.push(entity)
		instance.entitiesMap.set(entity.id, entity)
	}


}
