import EntityAPI from "../../../../../engine-core/lib/utils/EntityAPI";
import SelectionStore from "../../../stores/SelectionStore";
import EngineStore from "../../../stores/EngineStore";
import {v4} from "uuid";
import HierarchyController from "../lib/HierarchyController";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/dispatch-renderer-entities";

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
        dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toAdd})
    else {
        SelectionStore.engineSelected = newSelection
        HierarchyController.updateHierarchy()
        EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
}