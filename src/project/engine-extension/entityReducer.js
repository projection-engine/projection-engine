import PickComponent from "../engine/components/PickComponent"
import COMPONENTS from "../engine/templates/COMPONENTS"
import {v4} from "uuid"

export const ENTITY_ACTIONS = {
    ADD: 0,

    UPDATE: 2,
    UPDATE_COMPONENT: 3,

    REMOVE: 4,
    DISPATCH_BLOCK: 6,
    PUSH_BLOCK: 7,
    REMOVE_BLOCK: 8,
    CLEAR: 9,
    LINK_MULTIPLE: 10
}


export default function entityReducer({type, payload}, state, setChangeID) {
    setChangeID(v4())
    if (payload?.entityID > -1) {
        const entity = state.get(payload.entityID)
        switch (type) {
        case ENTITY_ACTIONS.UPDATE: {
            const {key, data} = payload
            entity[key] = data
            state.set(entity.id, entity)
            break
        }
        case ENTITY_ACTIONS.REMOVE:
            state.delete(entity.id)
            break
        case ENTITY_ACTIONS.UPDATE_COMPONENT: {
            const {
                key,
                data,
            } = payload
            entity.components[key] = data

            state.set(entity.id, entity)
            break
        }
        default:
            break
        }
    } else
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

            console.log(state)
            break
        }
        default:
            break
        }
}
