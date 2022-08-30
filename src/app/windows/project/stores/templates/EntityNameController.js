import RendererController from "../../libs/engine/production/controllers/RendererController";
import Entity from "../../libs/engine/production/templates/Entity";
import RendererStoreController from "../RendererStoreController";
import UIStoreController from "../UIStoreController";

export default class EntityNameController {
    static byName = new Map()

    static renameEntity(newName, entity) {
        const found = EntityNameController.byName.get(newName)
        let validName = true
        if (found) {
            validName = !RendererController.entitiesMap.get(found)
        }
        if (validName) {
            entity.name = newName
            EntityNameController.byName.set(newName, entity.id)
            if (entity instanceof Entity)
                RendererStoreController.updateEngine()
            else
                UIStoreController.updateStore()
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