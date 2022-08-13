import dispatchEntities, {ENTITY_ACTIONS} from "../stores/dispatch-entities";
import DataStoreController from "../stores/DataStoreController";
import Renderer from "./engine/Renderer";

export default class ViewportActions {
    static toCopy = []

    static copy(single, target, engine) {
        ViewportActions.toCopy = target ? target : (single ? [engine.selected[0]] : engine.selected)
        alert.pushAlert(`Entities copied (${engine.selected.length}).`, "info")
    }

    static deleteSelected() {
        const engine = DataStoreController.engine
        dispatchEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: [...engine.selected]
        })
    }

    static invertSelection() {
        const engine = DataStoreController.engine
        const newArr = []
        const notValid = {}
        const engineCopy = {...engine}
        for (let i in engineCopy.selected)
            notValid[engineCopy.selected[i]] = true
        const entities = window.renderer.entities

        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }
        engineCopy.selected = newArr
        DataStoreController.updateEngine(engineCopy)
    }

    static paste(parent) {
        let block = []
        if (!ViewportActions.toCopy)
            return
        ViewportActions.toCopy.forEach(t => {
            const found = Renderer.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = parent ? Renderer.entitiesMap.get(parent) : undefined
                block.push(clone)
            }
        })

        dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")

    }

    static group() {
        const engine = DataStoreController.engine
        ViewportActions.toCopy = engine.selected
        if (engine.selected.length > 1)
            dispatchEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }
    static selectAll() {
        DataStoreController.updateEngine({...DataStoreController.engine, selected: window.renderer.entities.filter(e => !e.isFolder).map(e => e.id)})
    }
    static fixateActive() {
        const engine = DataStoreController.engine
        if (engine.selected[0])
            DataStoreController.updateEngine({...engine, lockedEntity: engine.selected[0]})
    }
}