import Engine from "../../../../engine-core/Engine";
import getPickerId from "../../../../engine-core/utils/get-picker-id";
import AXIS from "../../../../engine-tools/static/AXIS";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";
import HierarchyController from "../views/hierarchy/lib/HierarchyController";

import UndoRedoAPI from "./utils/UndoRedoAPI";
import ACTION_HISTORY_TARGETS from "../static/ACTION_HISTORY_TARGETS";
import EntityNameController from "./controllers/EntityNameController";
import getPivotPointMatrix from "../../../../engine-tools/utils/get-pivot-point-matrix";
import SelectionStore from "../stores/SelectionStore";
import Entity from "../../../../engine-core/instances/Entity";

function removeHierarchy(state, entity) {
    if (!entity)
        return
    for (let c = 0; c < entity.children.length; c++)
        removeHierarchy(state, entity.children[c])
    EntityAPI.removeEntity(entity.id)
}

function deleteEntity(entity: Entity, single?: boolean) {
    if (!single)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
    if (entity.parent)
        entity.parent.children = entity.parent.children.filter(e => e !== entity)
    removeHierarchy(Engine.entities.map, entity)
}



export default class EntityManager {
    static #updateStructure(replacedMap?: { [key: string]: boolean }) {
        const arr = Engine.entities.array
        console.trace(arr.length)
        for (let i = 0; i < arr.length; i++) {
            const entity = arr[i]
            entity.pickID = getPickerId(i + AXIS.ZY + 1)
            if (!entity.parentCache && !replacedMap?.[entity.parent?.id])
                continue
            if (entity.parent && !replacedMap?.[entity.parent?.id])
                entity.parentCache = entity.parent.id
            const parent = Engine.entities.map.get(entity.parentCache)
            if (parent) {
                entity.parentCache = undefined
                EntityAPI.linkEntities(entity, parent)
            }
        }

        HierarchyController.updateHierarchy()
    }

    static replaceBlock(toRemove: string[], toAdd: Entity[]) {
        const replacedMap = {}
        for (let i = 0; i < toRemove.length; i++)
            deleteEntity(Engine.entities.map.get(toRemove[i]), true)
        for (let i = 0; i < toAdd.length; i++) {
            const e = toAdd[i]
            EntityAPI.addEntity(e)
            replacedMap[e.id] = true
            EntityNameController.renameEntity(e.name, e)
        }
        EntityManager.#updateStructure(replacedMap)
    }

    static appendBlock(block: Entity[], cleanPush?: boolean) {
        console.trace(Engine.entities.array.length)
        if (cleanPush) {
            Engine.entities.map.forEach(e => EntityAPI.removeEntity(e.id))
            EntityNameController.byName.clear()
        } else
            UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        const selected = []
        for (let i = 0; i < block.length; i++) {
            const e = block[i]
            selected.push(e.id)
            EntityAPI.addEntity(e)
            getPivotPointMatrix(e)
            EntityNameController.renameEntity(e.name, e)
        }
        if (!cleanPush) {
            SelectionStore.updateStore({
                ...SelectionStore.data,
                TARGET: SelectionStore.TYPES.ENGINE,
                array: selected
            })
            UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        } else
            SelectionStore.lockedEntity = block[0]?.id
        EntityManager.#updateStructure()
    }

    static removeBlock(payload:string[]) {
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        for (let i = 0; i < payload.length; i++)
            deleteEntity(Engine.entities.map.get(payload[i]), true)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: Engine.entities.array[0].id
        })
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        EntityManager.#updateStructure()
    }

    static add(entity:Entity) {
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        EntityNameController.renameEntity(entity.name, entity)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [entity.id],
            lockedEntity: entity.id
        })
        getPivotPointMatrix(entity)
        EntityAPI.addEntity(entity)
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        EntityManager.#updateStructure()
    }

    static linkMultiple(payload:string[]) {
        const values = Engine.entities.array
        for (let i = 0; i < values.length; i++) {
            const s = values[i]
            if (payload.indexOf(s.id) > 0) {
                const found = Engine.entities.map.get(payload[0])
                EntityAPI.linkEntities(s, found)
            }
        }
        EntityManager.#updateStructure()
    }

    static removeEntity(id:string) {
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        deleteEntity(Engine.entities.map.get(id))
        UndoRedoAPI.save(Engine.entities.array, ACTION_HISTORY_TARGETS.ENGINE)
        EntityManager.#updateStructure()
    }
}