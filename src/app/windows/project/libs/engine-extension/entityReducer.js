import PickComponent from "../engine/components/PickComponent"
import COMPONENTS from "../engine/data/COMPONENTS"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
import StoreController from "../../stores/StoreController";

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    CLEAR: "CLEAR",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}


export default function entityReducer({type, payload}, state, engineState=StoreController.engine) {
    const initialSize = state.size
    switch (type) {
    case ENTITY_ACTIONS.REMOVE:
        state.delete(payload.entityID)
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
        state.clear()
        break
    case ENTITY_ACTIONS.ADD: {
        const entity = payload
        entity.components[COMPONENTS.PICK] = new PickComponent(undefined, state.size + 2)
        state.set(entity.id, entity)
        break
    }
    case ENTITY_ACTIONS.REMOVE_BLOCK: {
        const block = payload
        if (Array.isArray(block)) {
            for (let i = 0; i < block.length; i++)
                state.delete(block[i])
            const values = state.values()
            for (let i = 0; i < values.length; i++) {
                if (values[i]?.parent)
                    state.delete(values[i].parent.id)
            }
        }
        break
    }
    case ENTITY_ACTIONS.DISPATCH_BLOCK:
    case ENTITY_ACTIONS.PUSH_BLOCK: {
        const block = payload
        if (Array.isArray(block))
            for (let i = 0; i < block.length; i++) {
                const e = block[i]
                e.components[COMPONENTS.PICK] = new PickComponent(undefined, i + state.size + 2)
                state.set(e.id, e)
            }

        break
    }
    default:
        break
    }

    if (initialSize !== state.size) {
        const arr = Array.from(state.values())
        for (let i = 0; i < arr.length; i++) {
            const entity = arr[i]
            if (typeof entity.parent === "string") {
                const parent = state.get(entity.parent)
                if (parent) {
                    entity.parent = parent
                    parent.children.push(entity)
                }
            }
        }

        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
            payload: state
        })

        StoreController.updateEngine( {...engineState, changeID: v4()})
    }
}
