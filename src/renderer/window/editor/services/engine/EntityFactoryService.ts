import {vec3, vec4} from "gl-matrix"


import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
import SettingsStore from "../../../shared/stores/SettingsStore"
import MeshComponent from "../../../../engine/core/components/MeshComponent"
import LightComponent from "../../../../engine/core/components/LightComponent"
import EngineStateService from "./EngineStateService"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import EditorEntity from "../../../../engine/tools/EditorEntity";
import TransformationComponent from "@engine-core/components/TransformationComponent";


export default class EntityFactoryService {
    static #create(_, k: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value
        descriptor.value = function (...args) {
            let result
            EntityManager.delayedOperation(() => {
                result = original.call(this, ...args)
                return []
            })
            EngineStateService.add(result)
            EntityFactoryService.translateEntity(result)
            return result
        }
    }

    static translateEntity(entity: EditorEntity, rotation = CameraAPI.rotationBuffer, translation = CameraAPI.translationBuffer) {
        const transformComponent = entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (SettingsStore.getData().spawnOnOrigin) {
            vec3.copy(transformComponent.translation, [0, 0, 0])
            transformComponent.__changedBuffer[0] = 1
            return
        }

        const position = <vec4>[0, 0, -(SettingsStore.getData().spawnDistanceFromCamera || 10), 1]
        vec4.transformQuat(position, position, rotation)
        vec3.add(transformComponent._translation, translation, <vec3>position)
        transformComponent.__changedBuffer[0] = 1
    }

    @EntityFactoryService.#create
    static createEmpty() {
        const entity = EditorEntityManager.create(undefined)
        entity.name = LocalizationEN.NEW_ENTITY
        return entity
    }

    @EntityFactoryService.#create
    static createMesh(id?: EngineEntity) {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.MESH_RENDERER
        const m = EntityManager.addComponent(entity.id, Components.MESH) as MeshComponent
        m.meshID = id
        return entity
    }

    @EntityFactoryService.#create
    static createProbe() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.LIGHT_PROBE
        EntityManager.addComponent(entity.id, Components.LIGHT_PROBE)

        return entity
    }

    @EntityFactoryService.#create
    static createAtmosphere() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.ATMOSPHERE_RENDERER
        EntityManager.addComponent(entity.id, Components.ATMOSPHERE)
        return entity
    }

    @EntityFactoryService.#create
    static createLight(type) {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.NEW_LIGHT
        const component = EntityManager.addComponent(entity.id, Components.LIGHT) as LightComponent
        component.type = type
        return entity
    }

    @EntityFactoryService.#create
    static createCamera() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.CAMERA
        EntityManager.addComponent(entity.id, Components.CAMERA)
        return entity
    }

    @EntityFactoryService.#create
    static createUI() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.UI_RENDERER
        EntityManager.addComponent(entity.id, Components.UI)
        return entity
    }

    @EntityFactoryService.#create
    static createSprite() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.SPRITE_RENDERER
        EntityManager.addComponent(entity.id, Components.SPRITE)
        return entity
    }

    @EntityFactoryService.#create
    static createDecal() {
        const entity = EditorEntityManager.create()
        entity.name = LocalizationEN.DECAL_RENDERER
        EntityManager.addComponent(entity.id, Components.DECAL)
        return entity
    }
}
