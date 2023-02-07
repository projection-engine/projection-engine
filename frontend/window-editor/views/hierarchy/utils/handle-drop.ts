import SelectionStore from "../../../../shared/stores/SelectionStore";

import HierarchyController from "../../../lib/HierarchyController";
import EntityManager from "../../../lib/EntityManager";
import Entity from "../../../../../engine-core/instances/Entity";

export default function handleDrop(event, entityDragged, node) {
    const toSave = Array.isArray(entityDragged) ? entityDragged : [entityDragged]
    const toAdd = [], newSelection = []
    for (let i = 0; i < toSave.length; i++) {
        const currentEntity = <Entity>toSave[i]
        if (event.ctrlKey) {
            if (!node)
                currentEntity.removeParent()
            else
                currentEntity.addParent(node)
        } else if (event.shiftKey) {
            const clone = currentEntity.clone()
            clone.removeParent()
            clone.parentID = node?.id
            toAdd.push(clone)
            newSelection.push(clone.id)
        }
    }

    if (toAdd.length > 0)
        EntityManager.appendBlock(toAdd, false)
    else {
        SelectionStore.engineSelected = newSelection
        HierarchyController.updateHierarchy()
    }
}