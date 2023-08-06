import Engine from "../../../../engine/core/Engine"
import AXIS from "../../../../engine/tools/static/AXIS"
import EntityAPI from "../../../../engine/core/lib/utils/EntityAPI"
import EntityHierarchyService from "./EntityHierarchyService"
import EditorActionHistory from "../EditorActionHistory"
import EntityNamingService from "./EntityNamingService"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
import EditorEntity from "../../../../engine/tools/EditorEntity"
import PickingAPI from "../../../../engine/core/lib/utils/PickingAPI"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"

import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import GizmoUtil from "../../../../engine/tools/gizmo/util/GizmoUtil"
import LevelService from "./LevelService";
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import EntityManager from "@engine-core/EntityManager";


function checkLevel(_, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function (...args) {
        if (!LevelService.getInstance().loadedLevel) {
            ToastNotificationSystem.getInstance().error(LocalizationEN.NO_LEVEL_LOADED)
            return
        }
        return original.call(this, ...args)
    }
}


export default class EngineStateService {

    @checkLevel
    static replaceBlock(toRemove: string[], toAdd: EditorEntity[]) {

        const replacedMap = {}
        EngineStateService.removeBlock(toRemove)
        for (let i = 0; i < toAdd.length; i++) {
            const entity = toAdd[i]
            EntityAPI.addEntity(entity)
            replacedMap[entity.id] = true
            EntityNamingService.renameEntity(entity.name, entity)
        }
        EntityHierarchyService.updateHierarchy()

    }

    @checkLevel
    static appendBlock(block: EditorEntity[]) {
        EditorActionHistory.save(block, true)
        EntityAPI.addGroup(block)
        EntityNamingService.renameInBlock(block)
        for (let i = 0; i < block.length; i++)
            GizmoUtil.createTransformationCache(block[i])
        EditorActionHistory.save(block)
        EntityHierarchyService.updateHierarchy()

    }

    @checkLevel
    static removeBlock(payload: EngineEntity[]) {
        const hierarchy: { [key: string]: EditorEntity } = {}
        for (let i = 0; i < payload.length; i++) {
            const entity = Engine.entities.get(payload[i])
            if (!entity)
                continue
            hierarchy[entity.id] = entity
            QueryAPI.getHierarchyToObject(entity, hierarchy)
        }

        const entities = Object.values(hierarchy)
        EditorActionHistory.save(entities)
        EditorActionHistory.save(entities, true)

        EntityAPI.removeGroup(entities, false)

        EntitySelectionStore.updateStore({array: []})
        EntitySelectionStore.setLockedEntity(EntityManager.getEntityKeys()[0])
        EntityHierarchyService.updateHierarchy()

    }

    @checkLevel
    static add(entity: EditorEntity) {
        EditorActionHistory.save(entity, true)
        EditorActionHistory.save(entity)

        EntityNamingService.renameEntity(entity.name, entity)
        GizmoUtil.createTransformationCache(entity)
        EntityAPI.addEntity(entity)
        EntitySelectionStore.updateStore({
            array: [entity.id]
        })
        EntitySelectionStore.setLockedEntity(entity.id)
        EntityHierarchyService.updateHierarchy()

    }

    @checkLevel
    static linkMultiple(payload: EngineEntity[]) {
        const values = EditorEntityManager.entities.array
        for (let i = 0; i < values.length; i++) {
            const s = values[i]
            if (payload.indexOf(s.id) > 0)
                EntityManager.addParent(s.id, payload[0])
        }
        EntityHierarchyService.updateHierarchy()
    }

}
