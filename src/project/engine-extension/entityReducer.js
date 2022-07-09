import PickComponent from "../engine/components/PickComponent"
import COMPONENTS from "../engine/templates/COMPONENTS"
import {v4} from "uuid"

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    CLEAR: "CLEAR",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}


export default function entityReducer({type, payload}, state, setChangeID) {
    const initialSize = state.size
    if (type === ENTITY_ACTIONS.REMOVE) 
        state.delete(payload.entityID)
    else
        switch (type) {
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
            for (let i = 0; i < block.length; i++) {
                const entity = block[i]
                if(typeof entity.parent === "string") {
                    const parent = state.get(entity.parent)
                    if(parent) {
                        entity.parent = parent
                        parent.children.push(entity)
                    }
                }
            }
            break
        }
        default:
            break
        }
    if(initialSize !== state.size)
        setChangeID(v4())
}
