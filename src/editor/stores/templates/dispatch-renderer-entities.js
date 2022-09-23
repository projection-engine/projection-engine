import {v4} from "uuid"
import EngineStore from "../EngineStore";
import removeHierarchy from "../utils/remove-hierarchy";

import EntityNameController from "../../libs/EntityNameController";
import AXIS from "../../../../public/engine/editor/data/AXIS";
import ActionHistoryAPI from "../../libs/ActionHistoryAPI";
import SelectionStore from "../SelectionStore";
import {Engine, EntityAPI, getPickerId} from "../../../../public/engine/production";
import HierarchyController from "../../libs/HierarchyController";
import QueryAPI from "../../../../public/engine/production/apis/utils/QueryAPI";

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
            deleteEntity(QueryAPI.getEntityByID(payload))
            save()
            break
        case ENTITY_ACTIONS.LINK_MULTIPLE: {
            const values = Engine.entities
            for (let i = 0; i < values.length; i++) {
                const s = values[i]
                if (payload.indexOf(s.id) > 0) {
                    const found = QueryAPI.getEntityByID(payload[0])
                    EntityAPI.linkEntities(s, found)
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
            EntityAPI.addEntity(payload)
            save()
            break

        }
        case ENTITY_ACTIONS.REMOVE_BLOCK: {
            save()
            if (Array.isArray(payload))
                for (let i = 0; i < payload.length; i++)
                    deleteEntity(QueryAPI.getEntityByID(payload[i]), true)
            save()
            break
        }
        case ENTITY_ACTIONS.DISPATCH_BLOCK:
        case ENTITY_ACTIONS.PUSH_BLOCK: {
            if (type === ENTITY_ACTIONS.DISPATCH_BLOCK) {
                Engine.entitiesMap.forEach(e => EntityAPI.removeEntity(e.id))
                EntityNameController.byName.clear()

            } else
                save()
            const block = payload
            const selected = []
            if (Array.isArray(block))
                for (let i = 0; i < block.length; i++) {
                    const e = block[i]
                    selected.push(e.id)
                    EntityAPI.addEntity(e)
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
                SelectionStore.lockedEntity = block[0]?.id
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
        const parent = QueryAPI.getEntityByID(entity.parentCache)

        if (parent) {
            entity.parentCache = undefined
            entity.parent = parent
            parent.children.push(entity)
        } else
            entity.parent = undefined

    }
    HierarchyController.updateHierarchy()
    EngineStore.updateStore({...EngineStore.engine, changeID})
}
