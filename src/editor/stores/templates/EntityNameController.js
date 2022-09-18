import EngineStore from "../EngineStore";
import QueryAPI from "../../../../public/engine/production/apis/utils/QueryAPI";
import {v4} from "uuid";
import SelectionStore from "../SelectionStore";

export default class EntityNameController {
    static byName = new Map()

    static renameEntity(newName, entity) {
        const found = EntityNameController.byName.get(newName)
        let validName = true
        if (found) {
            validName = !QueryAPI.getEntityByID(found)
        }
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