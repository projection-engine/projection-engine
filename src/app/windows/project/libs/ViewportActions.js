import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import EngineStore from "../stores/EngineStore";
import RendererController from "./engine/production/controllers/RendererController";
import CameraTracker from "./engine/editor/libs/CameraTracker";

export default class ViewportActions {
    static toCopy = []

    static copy(single, target) {
        const e = EngineStore.engine
        ViewportActions.toCopy = target ? target : (single ? [e.selected[0]] : e.selected)
        alert.pushAlert(`Entities copied (${e.selected.length}).`, "info")
    }

    static focus(entity) {
        if (!entity)
            return
        CameraTracker.radius = 10
        CameraTracker.centerOn = [entity.matrix[12], entity.matrix[13], entity.matrix[14]]

        CameraTracker.update()
    }

    static deleteSelected() {
        const engine = EngineStore.engine
        dispatchRendererEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: [...engine.selected]
        })
    }

    static invertSelection() {
        const engine = EngineStore.engine
        const newArr = []
        const notValid = {}
        const engineCopy = {...engine}
        for (let i in engineCopy.selected)
            notValid[engineCopy.selected[i]] = true
        const entities = Array.from(RendererController.entitiesMap.values())

        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }
        engineCopy.selected = newArr
        EngineStore.updateStore(engineCopy)
    }

    static paste(parent) {
        let block = []
        if (!ViewportActions.toCopy)
            return
        ViewportActions.toCopy.forEach(t => {
            const found = RendererController.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = parent ? RendererController.entitiesMap.get(parent) : undefined
                block.push(clone)
            }
        })

        dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")

    }

    static group() {
        const engine = EngineStore.engine
        ViewportActions.toCopy = engine.selected
        if (engine.selected.length > 1)
            dispatchRendererEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }

    static selectAll() {
        EngineStore.updateStore({
            ...EngineStore.engine,
            selected: window.renderer.entities.filter(e => !e.isFolder).map(e => e.id)
        })
    }

    static fixateActive() {
        const engine = EngineStore.engine
        if (engine.selected[0])
            EngineStore.updateStore({...engine, lockedEntity: engine.selected[0]})
    }
}