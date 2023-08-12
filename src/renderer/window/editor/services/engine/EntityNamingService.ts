import EditorEntity from "../../../../engine/tools/EditorEntity"
import EntityManager from "../../../../engine/core/EntityManager"
import EntityHierarchyService from "./EntityHierarchyService";

export default class EntityNamingService {
	static #byName = new Map<string, EngineEntity>()
	static get byName(){
		return EntityNamingService.#byName
	}

	static clear(){
		EntityNamingService.#byName.clear()
	}

	static renameEntity(newName:string, entity:EditorEntity) {
		const found = EntityNamingService.#byName.get(newName)
		let validName = true
		if (found !== entity.id)
			validName = !EntityManager.entityExists(found)
		if (validName) {
			entity.name = newName
			EntityNamingService.#byName.set(newName, entity.id)
			EntityHierarchyService.updateHierarchy()
		} else{
			{
				const subWord = ".00"
				const originalPrefix = subWord+newName.split(subWord).pop()
				let currentIndex = parseInt(newName.split(subWord).pop())
				if(isNaN(currentIndex))
					currentIndex = 1
				else
					currentIndex += 1
				EntityNamingService.renameEntity(newName.replace(originalPrefix, "") + subWord + currentIndex, entity)
			}
		}
	}
	static renameInBlock(entities:EditorEntity[]){
		const groupID = crypto.randomUUID().substring(0, 3)
		for (let i = 0; i < entities.length; i++){
			const entity = entities[i]
			if(EntityNamingService.#byName.has(entity.name))
				entity.name = entity.name + "." + i.toString().padStart(3, "0") + "(" + groupID + ")"
			EntityNamingService.#byName.set(entity.name, entity.id)
		}
	}
}
