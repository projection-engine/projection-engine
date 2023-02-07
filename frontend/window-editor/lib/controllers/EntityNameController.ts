import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";

import SelectionStore from "../../../shared/stores/SelectionStore";
import Entity from "../../../../engine-core/instances/Entity";
import HierarchyController from "../HierarchyController";

export default class EntityNameController {
    static #byName = new Map<string, string>()
    static get byName(){
        return EntityNameController.#byName
    }

    static set byName(data:Map<string, string>){
        if(data instanceof Map)
            EntityNameController.#byName = data
    }
    static renameEntity(newName:string, entity:Entity) {
        const found = EntityNameController.#byName.get(newName)
        let validName = true
        if (found !== entity.id)
            validName = !QueryAPI.getEntityByID(found)
        if (validName) {
            entity.name = newName
            EntityNameController.#byName.set(newName, entity.id)
            HierarchyController.updateHierarchy()
            SelectionStore.updateStore()
        } else{
            {
                const subWord = ".00"
                const originalPrefix = subWord+newName.split(subWord).pop()
                let currentIndex = parseInt(newName.split(subWord).pop())
                if(isNaN(currentIndex))
                    currentIndex = 1
                else
                    currentIndex += 1
                EntityNameController.renameEntity(newName.replace(originalPrefix, "") + subWord + currentIndex, entity)
            }
        }
    }
}