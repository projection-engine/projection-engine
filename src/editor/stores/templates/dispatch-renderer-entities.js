import {v4} from "uuid"
import EngineStore from "../EngineStore";
import removeHierarchy from "../utils/remove-hierarchy";

import EntityNameController from "./EntityNameController";
import AXIS from "../../../../public/engine/editor/data/AXIS";
import ActionHistoryAPI from "../../libs/ActionHistoryAPI";
import SelectionStore from "../SelectionStore";
import {BundlerAPI, Engine, getPickerId} from "../../../../public/engine/production";

export const ENTITY_ACTIONS = {
    ADD: "ADD",

    REMOVE: "REMOVE",
    DISPATCH_BLOCK: "DISPATCH_BLOCK",
    PUSH_BLOCK: "PUSH_BLOCK",
    REMOVE_BLOCK: "REMOVE_BLOCK",
    LINK_MULTIPLE: "LINK_MULTIPLE"
}

function deleteEntity(entity, single) {
    if (!entity)
        return
    if (!single)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
    if (entity.parent)
        entity.parent.children = entity.parent.children.filter(e => e !== entity)
    removeHierarchy(Engine.entitiesMap, entity)
}

export default function dispatchRendererEntities({type, payload}) {

    let changeID = v4()

    function save() {
        ActionHistoryAPI.pushBlockChange(Array.from(Engine.entitiesMap.values()))
    }

    switch (type) {
        case ENTITY_ACTIONS.REMOVE:
            save()
            deleteEntity(Engine.entitiesMap.get(payload))
            save()
            break
        case ENTITY_ACTIONS.LINK_MULTIPLE: {
            const values = Engine.entities
            for (let i = 0; i < values.length; i++) {
                const s = values[i]
                if (payload.indexOf(s.id) > 0) {
                    const found = Engine.entitiesMap.get(payload[0])
                    s.parent = found
                    found.children.push(s)
                }
            }
            break
        }
        case ENTITY_ACTIONS.ADD: {
            save()
            const entity = payload

            EntityNameController.renameEntity(entity.name, entity)
            SelectionStore.updateStore({
                ...SelectionStore.data,
                TARGET: SelectionStore.TYPES.ENGINE,
                array: [entity.id],
                lockedEntity: undefined
            })
            BundlerAPI.addEntity(payload)
            save()
            break

        }
        case ENTITY_ACTIONS.REMOVE_BLOCK: {
            save()
            console.log(payload)
            if (Array.isArray(payload))
                for (let i = 0; i < payload.length; i++)
                    deleteEntity(Engine.entitiesMap.get(payload[i]), true)
            save()
            break
        }
        case ENTITY_ACTIONS.DISPATCH_BLOCK:
        case ENTITY_ACTIONS.PUSH_BLOCK: {
            if (type === ENTITY_ACTIONS.DISPATCH_BLOCK) {
                Engine.entitiesMap.forEach(e => BundlerAPI.removeEntity(e.id))
                EntityNameController.byName.clear()

            } else
                save()
            const block = payload
            const selected = []
            if (Array.isArray(block))
                for (let i = 0; i < block.length; i++) {
                    const e = block[i]
                    selected.push(e.id)
                    BundlerAPI.addEntity(e)
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


    const arr = Engine.entities
    for (let i = 0; i < arr.length; i++) {
        const entity = arr[i]
        entity.pickID = getPickerId(i + AXIS.ZY + 1)
        if (!entity.parentCache)
            continue
        const parent = Engine.entitiesMap.get(entity.parentCache)

        if (parent) {
            entity.parentCache = undefined
            entity.parent = parent
            parent.children.push(entity)
        } else
            entity.parent = undefined

    }

    EngineStore.updateStore({...EngineStore.engine, changeID})
}
