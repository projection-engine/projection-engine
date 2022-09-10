import {v4} from "uuid"
import UIStore from "../UIStore";
import UserInterfaceController from "../../../../../../public/engine/production/controllers/UserInterfaceController";
import {ENTITY_ACTIONS} from "./dispatch-renderer-entities";
import removeHierarchy from "../utils/remove-hierarchy";


export default function dispatchUiEntities({type, payload}) {
    const data = UIStore.data
    const state = UserInterfaceController.entities
    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            data.selected = []
            const entity = state.get(payload)
            removeHierarchy(state, entity)
            break
        case ENTITY_ACTIONS.ADD: {
            const entity = payload
            state.set(entity.id, entity)
            data.selected = [entity.id]
            break
        }
        case ENTITY_ACTIONS.REMOVE_BLOCK: {
            const block = payload
            data.selected = []
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
            if (type !== ENTITY_ACTIONS.DISPATCH_BLOCK)
                data.selected = selected
            break
        }
        default:
            return
    }

    const arr = Array.from(state.values())
    for (let i = 0; i < arr.length; i++) {
        const entity = arr[i]
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

    UIStore.updateStore({...data, entities: state, changeID: v4()})
}
