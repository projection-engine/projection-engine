import PickComponent from "../engine/components/PickComponent"
import COMPONENTS from "../engine/data/COMPONENTS"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
import DataStoreController from "../../stores/DataStoreController";

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    CLEAR: "CLEAR",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}


export default function entityReducer({type, payload}, state, engineState = DataStoreController.engine) {
    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            const entity = state.get(payload.entityID)
            if(!entity)
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
            state.clear()
            break
        case ENTITY_ACTIONS.ADD: {
            const entity = payload
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
                    state.set(e.id, e)
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
    window.entityWorker.postMessage({
        type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
        payload: state,
        actionID: changeID
    })
    window.addEntityWorkerListener(() => {
        DataStoreController.updateEngine({...engineState, changeID})
    }, changeID)

}
