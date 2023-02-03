import Engine from "../../../engine-core/Engine";
import AXIS from "../../../engine-tools/static/AXIS";
import EntityAPI from "../../../engine-core/lib/utils/EntityAPI";
import HierarchyController from "../views/hierarchy/lib/HierarchyController";
import EditorActionHistory from "./utils/EditorActionHistory";
import EntityNameController from "./controllers/EntityNameController";
import getPivotPointMatrix from "../../../engine-tools/utils/get-pivot-point-matrix";
import SelectionStore from "../../shared/stores/SelectionStore";
import Entity from "../../../engine-core/instances/Entity";
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI";


export default class EntityManager {
    static #updateStructure(replacedMap?: { [key: string]: boolean }) {
        const arr = Engine.entities.array
        for (let i = 0; i < arr.length; i++) {
            const entity = arr[i]
            entity.setPickID(PickingAPI.getPickerId(i + AXIS.ZY + 1))
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
            EntityAPI.removeEntity(toRemove[i])
        for (let i = 0; i < toAdd.length; i++) {
            const entity = toAdd[i]
            EntityAPI.addEntity(entity)
            replacedMap[entity.id] = true
            EntityNameController.renameEntity(entity.name, entity)
        }
        EntityManager.#updateStructure(replacedMap)
    }

    static appendBlock(block: Entity[], cleanPush?: boolean) {
        if (cleanPush) {
            Engine.entities.map.forEach(e => EntityAPI.removeEntity(e.id))
            EntityNameController.byName.clear()
        } else
            EditorActionHistory.save(block, true)
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
            EditorActionHistory.save(block)
        } else
            SelectionStore.lockedEntity = block[0]?.id
        EntityManager.#updateStructure()
    }

    static removeBlock(payload: string[]) {
        const mapped = payload.map(e => Engine.entities.map.get(e))
        EditorActionHistory.save(mapped)
        EditorActionHistory.save(mapped, true)

        for (let i = 0; i < payload.length; i++)
            EntityAPI.removeEntity(payload[i])
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: Engine.entities.array[0]?.id
        })

        EntityManager.#updateStructure()
    }

    static add(entity: Entity) {
        EditorActionHistory.save(entity, true)
        EditorActionHistory.save(entity)
        EntityNameController.renameEntity(entity.name, entity)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [entity.id],
            lockedEntity: entity.id
        })
        getPivotPointMatrix(entity)
        EntityAPI.addEntity(entity)
        EntityManager.#updateStructure()
    }

    static linkMultiple(payload: string[]) {
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
}