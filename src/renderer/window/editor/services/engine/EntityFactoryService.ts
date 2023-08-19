import {vec3, vec4} from "gl-matrix"


import CameraManager from "@engine-core/managers/CameraManager"
import SettingsStore from "../../../shared/stores/SettingsStore"
import MeshComponent from "@engine-core/lib/components/MeshComponent"
import LightComponent from "@engine-core/lib/components/LightComponent"
import EngineStateService from "./EngineStateService"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import EditorEntity from "../../../../engine/tools/EditorEntity";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";


export default class EntityFactoryService {
    static _create(_, k: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function (...args) {
            let result: EditorEntity|undefined
            EntityManager.delayedOperation(() => {
                result = original.call(this, ...args)
                return []
            })
            EngineStateService.add(result)
            EntityFactoryService.translateEntity(result.id)
            return result
        }
    }

    static translateEntity(entity: EngineEntity) {
        const transformComponent = EntityManager.getComponent<TransformationComponent>(entity, Components.TRANSFORMATION)
        if (SettingsStore.getData().spawnOnOrigin) {
            vec3.copy(transformComponent.translation, [0, 0, 0])
            transformComponent.__changedBuffer[0] = 1
            return
        }

        const position = <vec4>[0, 0, -(SettingsStore.getData().spawnDistanceFromCamera || 10), 1]
        vec4.transformQuat(position, position, CameraManager.rotationBuffer)
        vec3.add(transformComponent._translation, CameraManager.translationBuffer, <vec3>position)
        transformComponent.__changedBuffer[0] = 1
    }

    @EntityFactoryService._create
    static createEmpty() {
        const entity = EditorEntityManager.create(undefined)
        entity.name = LocalizationEN.NEW_ENTITY
        return entity
    }

    @EntityFactoryService._create
    static createMesh(meshId?: string) {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.MESH_RENDERER
        const m = EntityManager.addComponent(entity.id, Components.MESH) as MeshComponent
        m.meshID = meshId
        return entity

    }

    @EntityFactoryService._create
    static createProbe() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.LIGHT_PROBE
        EntityManager.addComponent(entity.id, Components.LIGHT_PROBE)

        return entity
    }

    @EntityFactoryService._create
    static createAtmosphere() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.ATMOSPHERE_RENDERER
        EntityManager.addComponent(entity.id, Components.ATMOSPHERE)
        return entity
    }

    @EntityFactoryService._create
    static createLight(type) {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.NEW_LIGHT
        const component = EntityManager.addComponent(entity.id, Components.LIGHT) as LightComponent
        component.type = type
        return entity
    }

    @EntityFactoryService._create
    static createCamera() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.CAMERA
        EntityManager.addComponent(entity.id, Components.CAMERA)
        return entity
    }

    @EntityFactoryService._create
    static createUI() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.UI_RENDERER
        EntityManager.addComponent(entity.id, Components.UI)
        return entity
    }

    @EntityFactoryService._create
    static createSprite() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.SPRITE_RENDERER
        EntityManager.addComponent(entity.id, Components.SPRITE)
        return entity
    }

    @EntityFactoryService._create
    static createDecal() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.DECAL_RENDERER
        EntityManager.addComponent(entity.id, Components.DECAL)
        return entity
    }
}
