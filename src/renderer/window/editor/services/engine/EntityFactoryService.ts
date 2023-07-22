import COMPONENTS from "../../../../engine/core/static/COMPONENTS"
import {vec3, vec4} from "gl-matrix"


import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
import SettingsStore from "../../../shared/stores/SettingsStore"
import EntityAPI from "../../../../engine/core/lib/utils/EntityAPI"
import MeshComponent from "../../../../engine/core/instances/components/MeshComponent"
import LightComponent from "../../../../engine/core/instances/components/LightComponent"
import EntityHierarchyService from "./EntityHierarchyService"
import EngineStateService from "./EngineStateService"
import Engine from "../../../../engine/core/Engine"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"


export default class EntityFactoryService {
	static translateEntity(entity, rotation = CameraAPI.rotationBuffer, translation = CameraAPI.translationBuffer) {
		if (SettingsStore.getData().spawnOnOrigin) {
			vec3.copy(entity._translation, [0, 0, 0])
			entity.__changedBuffer[0] = 1
			return
		}

		const position = <vec4>[0, 0, -(SettingsStore.getData().spawnDistanceFromCamera || 10), 1]
		vec4.transformQuat(position, position, rotation)
		vec3.add(entity._translation, translation, <vec3>position)
		entity.__changedBuffer[0] = 1
	}

	static createEmpty(collection?:boolean) {
		const entity = EntityAPI.getNewEntityInstance(undefined, collection)
		entity.name = collection ? LocalizationEN.NEW_COLLECTION : LocalizationEN.NEW_ENTITY
		EngineStateService.add(entity)
	}

	static createMesh(id) {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.MESH_RENDERER
		const m = entity.addComponent<MeshComponent>(COMPONENTS.MESH)
		entity.addComponent(COMPONENTS.CULLING)
		m.meshID = id
		EntityFactoryService.translateEntity(entity)
		EngineStateService.add(entity)

	}

	static createProbe() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.LIGHT_PROBE
		entity.addComponent(COMPONENTS.LIGHT_PROBE)
		EntityFactoryService.translateEntity(entity)
		EngineStateService.add(entity)
	}

	static createAtmosphere() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.ATMOSPHERE_RENDERER
		entity.addComponent(COMPONENTS.ATMOSPHERE)
		EntityFactoryService.translateEntity(entity)
		EngineStateService.add(entity)
	}

	static createLight(type) {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.NEW_LIGHT
		EntityFactoryService.translateEntity(entity)
		const comp = entity.addComponent<LightComponent>(COMPONENTS.LIGHT)
		comp.type = type
		EngineStateService.add(entity)
	}

	static createCamera() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.CAMERA
		entity.addComponent(COMPONENTS.CAMERA)
		EntityFactoryService.translateEntity(entity)
		EngineStateService.add(entity)
	}

	static createUI() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.UI_RENDERER
		entity.addComponent(COMPONENTS.UI)
		EntityFactoryService.translateEntity(entity)
		EngineStateService.add(entity)
	}

	static createSprite() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.SPRITE_RENDERER
		entity.addComponent(COMPONENTS.SPRITE)
		EngineStateService.add(entity)
	}

	static createDecal() {
		const entity = EntityAPI.getNewEntityInstance()
		entity.name = LocalizationEN.DECAL_RENDERER
		entity.addComponent(COMPONENTS.DECAL)
		EngineStateService.add(entity)
	}

	static toggleEntityVisibility(entityID:string, noSubmit?:boolean) {
		EntityAPI.toggleVisibility(Engine.entities.get(entityID))
		if (!noSubmit)
			EntityHierarchyService.updateHierarchy()
	}
}