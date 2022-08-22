
import {v4} from "uuid"
import RendererStoreController from "../RendererStoreController";
import removeHierarchy from "../utils/remove-hierarchy";
import getPickerId from "../../libs/engine/utils/get-picker-id";

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    CLEAR: "CLEAR",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}



export default function dispatchRendererEntities({type, payload}) {
    const engine = RendererStoreController.engine
    const state = engine.entities
    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            engine.fixedEntity = undefined
            engine.selected = []

            const entity = state.get(payload)
            removeHierarchy(state, entity)
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
            if(type === ENTITY_ACTIONS.DISPATCH_BLOCK)
                state.clear()
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
        entity.pickID = getPickerId(i + 3)
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
    RendererStoreController.updateEngine(changes)
}
