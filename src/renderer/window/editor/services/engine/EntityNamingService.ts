import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
import Entity from "../../../../engine/core/instances/Entity"
import EntityUpdateService from "./EntityUpdateService"

export default class EntityNamingService {
	static #byName = new Map<string, string>()
	static get byName(){
		return EntityNamingService.#byName
	}

	static clear(){
		EntityNamingService.#byName.clear()
	}
	static set byName(data:Map<string, string>){
		if(data instanceof Map)
			EntityNamingService.#byName = data
	}
	static renameEntity(newName:string, entity:Entity) {
		const found = EntityNamingService.#byName.get(newName)
		let validName = true
		if (found !== entity.id)
			validName = !QueryAPI.getEntityByID(found)
		if (validName) {
			EntityUpdateService.updateEntity(entity,  newName, "name")
			EntityNamingService.#byName.set(newName, entity.id)
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
	static renameInBlock(entities:Entity[]){
		const groupID = crypto.randomUUID().substring(0, 3)
		for (let i = 0; i < entities.length; i++){
			const entity = entities[i]
			if(EntityNamingService.#byName.has(entity.name))
				entity.name = entity.name + "." + i.toString().padStart(3, "0") + "(" + groupID + ")"
			EntityNamingService.#byName.set(entity.name, entity.id)
		}
	}
}