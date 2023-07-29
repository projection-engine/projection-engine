import Engine from "../../../../engine/core/Engine"
import AXIS from "../../../../engine/tools/static/AXIS"
import EntityAPI from "../../../../engine/core/lib/utils/EntityAPI"
import EntityHierarchyService from "./EntityHierarchyService"
import EditorActionHistory from "../EditorActionHistory"
import EntityNamingService from "./EntityNamingService"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
import Entity from "../../../../engine/core/instances/Entity"
import PickingAPI from "../../../../engine/core/lib/utils/PickingAPI"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"

import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import GizmoUtil from "../../../../engine/tools/gizmo/util/GizmoUtil"


function checkLevel(_, propertyKey: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value
	descriptor.value = function (...args) {
		if (!Engine.loadedLevel) {
			ToastNotificationSystem.getInstance().error(LocalizationEN.NO_LEVEL_LOADED)
			return
		}
		return original.call(this, ...args)
	}
}


export default class EngineStateService {
	static #updateStructure(replacedMap?: { [key: string]: boolean }) {
		const arr = Engine.entities.array
		for (let i = 0; i < arr.length; i++) {
			const entity = arr[i]
			entity.setPickID(PickingAPI.getPickerId(i + AXIS.ZY + 1))
			if (!entity.parentID && !replacedMap?.[entity.parent?.id])
				continue
			if (entity.parent && !replacedMap?.[entity.parent?.id])
				entity.parentID = entity.parent.id
			const parent = Engine.entities.get(entity.parentID)
			if (parent) {
				entity.parentID = undefined
				entity.addParent(parent)
			}
		}

		EntityHierarchyService.updateHierarchy()
	}

    @checkLevel
	static replaceBlock(toRemove: string[], toAdd: Entity[]) {

		const replacedMap = {}
		EngineStateService.removeBlock(toRemove)
		for (let i = 0; i < toAdd.length; i++) {
			const entity = toAdd[i]
			EntityAPI.addEntity(entity)
			replacedMap[entity.id] = true
			EntityNamingService.renameEntity(entity.name, entity)
		}
		EngineStateService.#updateStructure(replacedMap)
	}

    @checkLevel
    static appendBlock(block: Entity[]) {
    	EditorActionHistory.save(block, true)
    	EntityAPI.addGroup(block)
    	EntityNamingService.renameInBlock(block)
    	for (let i = 0; i < block.length; i++)
    		GizmoUtil.createTransformationCache(block[i])
    	EditorActionHistory.save(block)
    	EngineStateService.#updateStructure()
    }

    @checkLevel
    static removeBlock(payload: string[]) {
    	const hierarchy: { [key: string]: Entity } = {}
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

    	EntitySelectionStore.updateStore({
    		array: []
    	})
    	EntitySelectionStore.setLockedEntity(Engine.entities.array[0]?.id)
    	EngineStateService.#updateStructure()
    }

    @checkLevel
    static add(entity: Entity) {
    	EditorActionHistory.save(entity, true)
    	EditorActionHistory.save(entity)

    	EntityNamingService.renameEntity(entity.name, entity)
    	GizmoUtil.createTransformationCache(entity)
    	EntityAPI.addEntity(entity)
    	EntitySelectionStore.updateStore({
    		array: [entity.id]
    	})
    	EntitySelectionStore.setLockedEntity(entity.id)
    	EngineStateService.#updateStructure()
    }

    @checkLevel
    static linkMultiple(payload: string[]) {
    	const values = Engine.entities.array
    	for (let i = 0; i < values.length; i++) {
    		const s = values[i]
    		if (payload.indexOf(s.id) > 0) {
    			const found = Engine.entities.get(payload[0])
    			s.addParent(found)
    		}
    	}
    	EngineStateService.#updateStructure()
    }
}
