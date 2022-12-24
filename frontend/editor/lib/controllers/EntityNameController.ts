import EngineStore from "../../stores/EngineStore";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import {v4} from "uuid";
import SelectionStore from "../../stores/SelectionStore";
import Entity from "../../../../engine-core/instances/Entity";

export default class EntityNameController {
    static byName = new Map<string, string>()

    static renameEntity(newName:string, entity:Entity) {
        const found = EntityNameController.byName.get(newName)
        let validName = true
        if (found !== entity.id)
            validName = !QueryAPI.getEntityByID(found)
        if (validName) {
            entity.name = newName
            EntityNameController.byName.set(newName, entity.id)
            EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
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