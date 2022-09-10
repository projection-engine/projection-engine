import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import EngineStore from "../stores/EngineStore";
import Engine from "../../../../public/engine/production/Engine";
import CameraTracker from "../../../../public/engine/editor/libs/CameraTracker";
import SelectionStore from "../stores/SelectionStore";

export default class ViewportActions {
    static toCopy = []

    static copy(single, target) {
        const selected = SelectionStore.engineSelected
        ViewportActions.toCopy = target ? target : (single ? [selected[0]] : selected)
        alert.pushAlert(`Entities copied (${selected.length}).`, "info")
    }

    static focus(entity) {
        if (!entity)
            return
        CameraTracker.radius = 10
        CameraTracker.centerOn = [entity.matrix[12], entity.matrix[13], entity.matrix[14]]

        CameraTracker.update()
    }

    static deleteSelected() {
        dispatchRendererEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: [...SelectionStore.engineSelected]
        })
    }

    static invertSelection() {
        const newArr = []
        const notValid = {}
        const oldSelected = SelectionStore.engineSelected
        for (let i = 0; i < oldSelected.length; i++)
            notValid[oldSelected[i]] = true
        const entities = Engine.entities
        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }

        SelectionStore.engineSelected = newArr
    }

    static paste(parent) {
        let block = []
        if (!ViewportActions.toCopy)
            return
        ViewportActions.toCopy.forEach(t => {
            const found = Engine.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = parent ? Engine.entitiesMap.get(parent) : undefined
                block.push(clone)
            }
        })

        dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")

    }

    static group() {
        const selected = SelectionStore.engineSelected
        ViewportActions.toCopy = selected
        if (selected.length > 1)
            dispatchRendererEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: selected
            })
    }

    static selectAll() {
        SelectionStore.engineSelected = Array.from(Engine.entitiesMap.keys())
    }

    static fixateActive() {
        const selected = SelectionStore.engineSelected
        if (selected[0])
            EngineStore.updateStore({...EngineStore.engine, lockedEntity: selected[0]})
    }
}