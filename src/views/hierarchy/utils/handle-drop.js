import EntityAPI from "../../../../public/engine/api/EntityAPI";
import SelectionStore from "../../../stores/SelectionStore";
import EngineStore from "../../../stores/EngineStore";
import {v4} from "uuid";
import HierarchyController from "../../../libs/HierarchyController";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";

export default function handleDrop(event, entityDragged, node) {
    if (event.ctrlKey) {
        EntityAPI.linkEntities(entityDragged, node)
        SelectionStore.engineSelected = [entityDragged.id]
        EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
        HierarchyController.updateHierarchy()
    } else if (event.shiftKey) {
        const clone = entityDragged.clone()
        clone.parent = undefined
        clone.parentCache = node?.id
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
    }
}