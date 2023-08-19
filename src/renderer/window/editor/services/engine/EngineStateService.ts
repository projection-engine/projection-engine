import EntityHierarchyService from "./EntityHierarchyService"
import EntityNamingService from "./EntityNamingService"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
import EditorEntity from "../../../../engine/tools/EditorEntity"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import GizmoUtil from "../../../../engine/tools/gizmo/util/GizmoUtil"
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import EntityManager from "@engine-core/managers/EntityManager";
import LevelManager from "@engine-core/managers/LevelManager";


export default class EngineStateService {
    static _checkLevel(_, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function (...args) {
            if (!LevelManager.loadedLevel) {
                ToastNotificationSystem.getInstance().error(LocalizationEN.NO_LEVEL_LOADED)
                return
            }
            return original.call(this, ...args)
        }
    }

    @EngineStateService._checkLevel
    static replaceBlock(toRemove: EngineEntity[], toAdd: EditorEntity[]) {

        const replacedMap = {}
        EntityManager.delayedOperation(() => {
            EngineStateService.removeBlock(toRemove)
            EntityManager.createEntitiesById(toAdd.map(e => e.id))
            for (let i = 0; i < toAdd.length; i++) {
                const entity = toAdd[i]
                replacedMap[entity.id] = true
                EntityNamingService.renameEntity(entity.name, entity)
            }
            return [{type: "delete", all: toRemove}, {type:"create", all: toAdd.map(e => e.id)}]
        })
        EntityHierarchyService.updateHierarchy()
    }

    @EngineStateService._checkLevel
    static appendBlock(block: EditorEntity[]) {
        EntityNamingService.renameInBlock(block)
        EntityManager.createEntitiesById(block.map(e => e.id))
        for (let i = 0; i < block.length; i++) {
            GizmoUtil.createTransformationCache(block[i])
        }
        EntityHierarchyService.updateHierarchy()
    }

    @EngineStateService._checkLevel
    static removeBlock(payload: EngineEntity[]) {
        EntityManager.removeEntities(payload)
        EntitySelectionStore.updateStore({array: []})
        EntitySelectionStore.setLockedEntity(EntityManager.getEntityKeys()[0])
        EntityHierarchyService.updateHierarchy()
    }

    @EngineStateService._checkLevel
    static add(entity: EditorEntity) {
        EntityNamingService.renameEntity(entity.name, entity)
        GizmoUtil.createTransformationCache(entity)
        EntityManager.createEntitiesById([entity.id])
        EntitySelectionStore.updateStore({
            array: [entity.id]
        })
        EntitySelectionStore.setLockedEntity(entity.id)
        EntityHierarchyService.updateHierarchy()

    }

    @EngineStateService._checkLevel
    static linkMultiple(payload: EngineEntity[]) {
        const values = EditorEntityManager.entities.array
        for (let i = 0; i < values.length; i++) {
            const s = values[i]
            if (payload.indexOf(s.id) > 0) {
                EntityManager.addParent(s.id, payload[0])
            }
        }
        EntityHierarchyService.updateHierarchy()
    }

    static toggleEntityVisibility(entityID:EngineEntity, noSubmit?:boolean) {
        EntityManager.toggleEntityActiveState(entityID)
        if (!noSubmit) {
            EntityHierarchyService.updateHierarchy()
        }
    }

}
