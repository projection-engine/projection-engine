import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import Entity from "../../../../engine-core/instances/Entity";
import EntityUpdateController from "./EntityUpdateController";

export default class NameController {
    static #byName = new Map<string, string>()
    static get byName(){
        return NameController.#byName
    }

    static clear(){
        NameController.#byName.clear()
    }
    static set byName(data:Map<string, string>){
        if(data instanceof Map)
            NameController.#byName = data
    }
    static renameEntity(newName:string, entity:Entity) {
        const found = NameController.#byName.get(newName)
        let validName = true
        if (found !== entity.id)
            validName = !QueryAPI.getEntityByID(found)
        if (validName) {
            EntityUpdateController.updateEntity(entity,  newName, "name")
            NameController.#byName.set(newName, entity.id)
        } else{
            {
                const subWord = ".00"
                const originalPrefix = subWord+newName.split(subWord).pop()
                let currentIndex = parseInt(newName.split(subWord).pop())
                if(isNaN(currentIndex))
                    currentIndex = 1
                else
                    currentIndex += 1
                NameController.renameEntity(newName.replace(originalPrefix, "") + subWord + currentIndex, entity)
            }
        }
    }
}