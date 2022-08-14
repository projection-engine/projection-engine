import PickComponent from "../libs/engine/templates/components/PickComponent"
import COMPONENTS from "../libs/engine/data/COMPONENTS"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../data/misc/ENTITY_WORKER_ACTIONS"
import DataStoreController from "./DataStoreController";

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    CLEAR: "CLEAR",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}


function removeHierarchy(state, entity) {
    if (!entity)
        return
    for (let c = 0; c < entity.children.length; c++)
        removeHierarchy(state, entity.children[c])
    state.delete(entity.id)
}

export default function dispatchEntities({type, payload}) {
    const engine = DataStoreController.engine
    const state = engine.entities
    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            engine.fixedEntity = undefined
            engine.selected = []

            const entity = state.get(payload.entityID)
            if (!entity)
                return;
            state.delete(entity.id)
            entity.children.forEach(child => {
                state.delete(child.id)
            })
            break
        case ENTITY_ACTIONS.LINK_MULTIPLE: {
            const values = state.values()
            for (let i = 0; i < values.length; i++) {
                const s = values[i]
                if (payload.indexOf(s.id) > 0) {
                    const found = state.get(payload[0])
                    s.parent = found
                    found.children.push(s)
                }
            }
            break
        }
        case ENTITY_ACTIONS.CLEAR:
            engine.fixedEntity = undefined
            engine.selected = []
            state.clear()
            break
        case ENTITY_ACTIONS.ADD: {
            const entity = payload
            state.set(entity.id, entity)
            engine.fixedEntity = undefined
            engine.selected = [entity.id]
            break
        }
        case ENTITY_ACTIONS.REMOVE_BLOCK: {
            const block = payload
            engine.selected = []
            engine.fixedEntity = undefined

            if (Array.isArray(block)) {
                for (let i = 0; i < block.length; i++) {
                    const currentID = block[i]
                    const entity = state.get(currentID)
                    removeHierarchy(state, entity)
                }
            }
            break
        }
        case ENTITY_ACTIONS.DISPATCH_BLOCK:
        case ENTITY_ACTIONS.PUSH_BLOCK: {
            const block = payload
            const selected = []
            if (Array.isArray(block))
                for (let i = 0; i < block.length; i++) {
                    const e = block[i]
                    selected.push(e.id)
                    state.set(e.id, e)
                }
            if (type !== ENTITY_ACTIONS.DISPATCH_BLOCK) {
                engine.fixedEntity = undefined
                engine.selected = selected
            }
            break
        }
        default:
            return
    }


    const arr = Array.from(state.values())
    for (let i = 0; i < arr.length; i++) {
        const entity = arr[i]
        entity.components[COMPONENTS.PICK] = new PickComponent(undefined, 2 + i)
        if (!entity.parentCache)
            continue
        const parent = state.get(entity.parentCache)

        if (parent) {
            entity.parentCache = undefined
            entity.parent = parent
            parent.children.push(entity)
        } else
            entity.parent = undefined

    }

    const changeID = v4()

    const changes = {...engine, entities: state, changeID}
    window.addEntityWorkerListener(() => DataStoreController.updateEngine(changes), changeID)
    window.entityWorker.postMessage({
        type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
        payload: state,
        actionID: changeID
    })


}
