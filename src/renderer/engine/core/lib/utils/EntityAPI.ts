import Engine from "../../Engine"
import TransformationWorkerAPI from "./TransformationWorkerAPI"
import UIAPI from "../rendering/UIAPI"
import PhysicsAPI from "../rendering/PhysicsAPI"
import EditorEntity from "../../../tools/EditorEntity"
import LightsAPI from "./LightsAPI"
import ResourceEntityMapper from "../../resource-libs/ResourceEntityMapper"
import QueryAPI from "./QueryAPI"
import * as crypto from "crypto";
import {UUID} from "crypto";
import EngineState from "../../EngineState";
import {Components,} from "@engine-core/engine.enum";

const COMPONENT_TRIGGER_UPDATE = [Components.LIGHT, Components.MESH]
const ENTITY_TYPED_ATTRIBUTES = [
    "_translation",
    "__changedBuffer",
    "_rotationQuaternion",
    "_rotationType",
    "_rotationEuler",
    "_rotationQuaternionFinal",
    "matrix",
    "absoluteTranslation",
    "_scaling",
    "baseTransformationMatrix",
    "pivotPoint",
    "previousModelMatrix",
    "distanceFromCamera",
    "__cullingMetadata",
]
const excludedKeys = [
	...ENTITY_TYPED_ATTRIBUTES,
	"components",
	"parent",
	"matrix",
	"_props",
	"id"
]
export default class EntityAPI {
	static getNewEntityInstance(id?: crypto.UUID): EditorEntity {
		return new EditorEntity(id)
	}


	static addGroup(entities: EditorEntity[]) {
		const levelEntity = Engine.loadedLevel
		if(!levelEntity)
			return
		const map = {}
		const size = entities.length
		for (let i = 0; i < size; i++){
			const entity = entities[i]
			map[entity.id] = entity
		}
		for (let i = 0; i < size; i++){
			const entity = entities[i]
			if (entity === levelEntity)
				continue
			if (!entity.parentID || entity.parentID === levelEntity.id)
				entity.addParent(levelEntity)
			else if (!entity.parent && entity.parentID) {
				if(Engine.entities.has(entity.parentID))
					entity.addParent(Engine.entities.get(entity.parentID as UUID))
				else
					entity.addParent(map[entity.parentID])
			}
			entity.parentID = undefined
		}
		Engine.entities.addBlock(entities, e => e.id)
		TransformationWorkerAPI.registerBlock(entities)
		ResourceEntityMapper.addBlock(entities)
	}

	static addEntity(entity?: EditorEntity): EditorEntity {
		if (!entity)
			return
		if (entity && Engine.entities.has(entity.id))
			return Engine.entities.get(entity.id)
		const target = entity ?? EntityAPI.getNewEntityInstance()
		if (!entity.parent && !entity.parentID)
			entity.addParent(Engine.loadedLevel)
		Engine.entities.set(target.id, target)
		TransformationWorkerAPI.registerEntity(target)
		EntityAPI.registerEntityComponents(target)
		return entity
	}

	static toggleVisibility(entity: EditorEntity): void {
		const newValue = !entity.active
		entity.active = newValue
		let needsLightUpdate = entity.meshComponent !== undefined || entity.lightComponent !== undefined
		let needsVisibilityUpdate = entity.meshComponent !== undefined
		const hierarchy = QueryAPI.getHierarchy(entity)
		hierarchy.forEach(child => {
			child.active = newValue
			needsVisibilityUpdate = needsVisibilityUpdate || child.meshComponent !== undefined
			needsLightUpdate = needsLightUpdate || child.meshComponent !== undefined || child.lightComponent !== undefined
		})

		if (needsLightUpdate)
			LightsAPI.packageLights(false, true)
		EngineState.visibilityNeedsUpdate = needsVisibilityUpdate
	}



	static removeGroup(toRemove: EditorEntity[], searchHierarchy: boolean) {
		const hierarchy: { [key: string]: EditorEntity } = {}
		for (let i = 0; i < toRemove.length; i++) {
			const entity = toRemove[i]
			if (entity !== Engine.loadedLevel)
				hierarchy[entity.id] = entity
			if (searchHierarchy)
				QueryAPI.getHierarchyToObject(entity, hierarchy)
		}
		const entities = Object.values(hierarchy)
		Engine.entities.removeBlock(entities, entity => entity.id)
		ResourceEntityMapper.removeBlock(entities)
		TransformationWorkerAPI.removeBlock(entities)

		let didLightsChange
		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i]
			if (entity === Engine.loadedLevel)
				continue

			if (entity.parent && !hierarchy[entity.parent.id])
				entity.removeParent()
			if (!Engine.isDev)
				for (let i = 0; i < entity.scripts.length; i++) {
					const scr = entity.scripts[i]
					if (scr && scr.onDestruction)
						scr.onDestruction()
				}
			PhysicsAPI.removeRigidBody(entity)
			UIAPI.deleteUIEntity(entity)
			if (entity.lightComponent !== undefined || entity.meshComponent !== undefined)
				didLightsChange = true
		}

		if (didLightsChange)
			LightsAPI.packageLights(false, true)
	}
}
