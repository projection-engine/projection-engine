import {v4} from "uuid"
import RendererStoreController from "../RendererStoreController";
import removeHierarchy from "../utils/remove-hierarchy";
import getPickerId from "../../libs/engine/production/utils/get-picker-id";
import EntityNameController from "./EntityNameController";
import AXIS from "../../libs/engine/editor/data/AXIS";
import COMPONENTS from "../../libs/engine/production/data/COMPONENTS";
import GPU from "../../libs/engine/production/GPU";

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
            EntityNameController.renameEntity(entity.name, entity)
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
            if (type === ENTITY_ACTIONS.DISPATCH_BLOCK) {
                state.clear()
                EntityNameController.byName.clear()
            }
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

        if (entity.components[COMPONENTS.POINT_LIGHT]) {
            entity.instancingGroupID = COMPONENTS.POINT_LIGHT
            entity.changed = true
            GPU.instancingGroup.get(COMPONENTS.POINT_LIGHT).entities.set(entity.id, entity)
        }
        if (entity.components[COMPONENTS.DIRECTIONAL_LIGHT]) {
            entity.instancingGroupID = COMPONENTS.DIRECTIONAL_LIGHT
            entity.changed = true
            GPU.instancingGroup.get(COMPONENTS.DIRECTIONAL_LIGHT).entities.set(entity.id, entity)
        }
        if (entity.components[COMPONENTS.PROBE]) {
            entity.instancingGroupID = COMPONENTS.PROBE
            entity.changed = true
            GPU.instancingGroup.get(COMPONENTS.PROBE).entities.set(entity.id, entity)
        }


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

    const changeID = v4()

    const changes = {...engine, entities: state, changeID}
    RendererStoreController.updateEngine(changes)
}
