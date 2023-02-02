import EntityAPI from "../../../../../engine-core/lib/utils/EntityAPI";
import SelectionStore from "../../../stores/SelectionStore";

import HierarchyController from "../lib/HierarchyController";
import EntityManager from "../../../lib/EntityManager";

export default function handleDrop(event, entityDragged, node) {

    const toSave = Array.isArray(entityDragged) ? entityDragged : [entityDragged]
    const toAdd = [], newSelection = []
    for(let i = 0; i < toSave.length; i++){
        const currentEntity = toSave[i]
        if (event.ctrlKey) {
            EntityAPI.linkEntities(currentEntity, node)
            newSelection.push(currentEntity.id)
        } else if (event.shiftKey) {
            const clone = currentEntity.clone()

            clone.parent = undefined
            clone.parentCache = node?.id
            toAdd.push(clone)
        }
    }

    if(toAdd.length > 0)
        EntityManager.appendBlock(toAdd, false)
    else {
        SelectionStore.engineSelected = newSelection
        HierarchyController.updateHierarchy()
    }
}