import Entity from "../../../engine/basic/Entity"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import FolderComponent from "../../../engine/components/FolderComponent"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"
import {HISTORY_ACTIONS} from "../../../hooks/historyReducer"

export function createFolder(engine){
    const newEntity = new Entity()
    newEntity.name = "New folder"
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    engine.dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
    })
    engine.dispatchChanges({
        type: HISTORY_ACTIONS.PUSHING_DATA, payload: [newEntity]
    })
}
export function getHierarchy(start, all){
    const result = []
    const direct = all.filter(e => e.linkedTo === start.id)
    direct.forEach(d => {
        result.push(...getHierarchy(d, all))
    })
    result.push(...direct)
    return result
}
