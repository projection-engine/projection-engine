import {v4} from "uuid"
import EngineStore from "../EngineStore";
import removeHierarchy from "../utils/remove-hierarchy";

import EntityNameController from "./EntityNameController";
import AXIS from "../../../../public/engine/editor/data/AXIS";
import ActionHistoryAPI from "../ActionHistoryAPI";
import SelectionStore from "../SelectionStore";
import {getPickerId} from "../../../../public/engine/production";

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
    const engine = EngineStore.engine
    const state = engine.entities
    let changeID = v4()

    function save() {
        ActionHistoryAPI.pushBlockChange(Array.from(state.values()))
    }

    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            save()
            SelectionStore.updateStore({
                ...SelectionStore.data,
                TARGET: SelectionStore.TYPES.ENGINE,
                array: [],
                lockedEntity: undefined
            })
            const entity = state.get(payload)
            removeHierarchy(state, entity)
            save()
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
            save()
            const entity = payload
            state.set(entity.id, entity)
            EntityNameController.renameEntity(entity.name, entity)
            SelectionStore.updateStore({
                ...SelectionStore.data,
                TARGET: SelectionStore.TYPES.ENGINE,
                array: [entity.id],
                lockedEntity: undefined
            })

            save()
            break

        }
        case ENTITY_ACTIONS.REMOVE_BLOCK: {
            save()
            const block = payload
            SelectionStore.updateStore({
                ...SelectionStore.data,
                TARGET: SelectionStore.TYPES.ENGINE,
                array: [],
                lockedEntity: undefined
            })

            if (Array.isArray(block))
                for (let i = 0; i < block.length; i++) {
                    const currentID = block[i]
                    const entity = state.get(currentID)
                    removeHierarchy(state, entity)
                }

            save()
            break
        }
        case ENTITY_ACTIONS.DISPATCH_BLOCK:
        case ENTITY_ACTIONS.PUSH_BLOCK: {
            if (type === ENTITY_ACTIONS.DISPATCH_BLOCK) {
                state.clear()
                EntityNameController.byName.clear()

            } else
                save()
            const block = payload
            const selected = []
            if (Array.isArray(block))
                for (let i = 0; i < block.length; i++) {
                    const e = block[i]
                    selected.push(e.id)
                    state.set(e.id, e)
                    EntityNameController.renameEntity(e.name, e)
                }
            if (type !== ENTITY_ACTIONS.DISPATCH_BLOCK) {
                SelectionStore.updateStore({
                    ...SelectionStore.data,
                    TARGET: SelectionStore.TYPES.ENGINE,
                    array: selected,
                    lockedEntity: undefined
                })
                save()

            } else
                SelectionStore.lockedEntity = block[0].id
            break
        }
        default:
            return
    }


    const arr = Array.from(state.values())
    for (let i = 0; i < arr.length; i++) {
        const entity = arr[i]
        entity.pickID = getPickerId(i + AXIS.ZY + 1)
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

    EngineStore.updateStore({...engine, entities: state, changeID})
}
