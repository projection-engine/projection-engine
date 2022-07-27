import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
import StoreController from "../../../stores/StoreController";

export default class ViewportActions {
    static toCopy

    static copy(single, target, engine) {
        ViewportActions.toCopy = target ? target : (single ? [engine.selected[0]] : engine.selected)
        alert.pushAlert(`Entities copied (${engine.selected.length}).`, "info")
    }

    static deleteSelected() {
        const engine = StoreController.engine
        const engineCopy = {...engine}
        const s = [...engineCopy.selected]
        engineCopy.selected = []
        engineCopy.lockedEntity = undefined

        engineCopy.dispatchEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: s
        })
        StoreController.updateEngine(engineCopy)
    }

    static invertSelection() {
        const engine = StoreController.engine
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
        StoreController.updateEngine(engineCopy)
    }

    static paste(parent) {
        const engine = StoreController.engine
        let block = []
        const engineCopy = {...engine}
        ViewportActions.toCopy.forEach(t => {
            const found = window.renderer.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = window.renderer.entitiesMap.get(parent)
                block.push(clone)
            }
        })
        engineCopy.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        engineCopy.selected = block.map(b => b.id)
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")
        StoreController.updateEngine(engineCopy)
    }

    static group() {
        const engine = StoreController.engine
        ViewportActions.toCopy = engine.selected
        if (engine.selected.length > 1)
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }

    static fixateActive() {
        const engine = StoreController.engine
        if (engine.selected[0])
            StoreController.updateEngine({...engine, lockedEntity: engine.selected[0]})
    }
}