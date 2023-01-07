import Entity from "../../../../../engine-core/instances/Entity";
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import {vec3, vec4} from "gl-matrix";
import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
import EngineStore from "../../stores/EngineStore";
import {v4} from "uuid";
import CameraAPI from "../../../../../engine-core/lib/utils/CameraAPI";
import SettingsStore from "../../stores/SettingsStore";
import EntityAPI from "../../../../../engine-core/lib/utils/EntityAPI";
import MeshComponent from "../../../../../engine-core/templates/components/MeshComponent";
import LightComponent from "../../../../../engine-core/templates/components/LightComponent";


export default class EntityConstructor {
    static translateEntity(entity, rotation = CameraAPI.rotationBuffer, translation = CameraAPI.translationBuffer) {
        if (SettingsStore.data.spawnOnOrigin) {
            vec3.copy(entity._translation, [0, 0, 0])
            entity.__changedBuffer[0] = 1
            return
        }

        const position = <vec4>[0, 0, -(SettingsStore.data.spawnDistanceFromCamera || 10), 1]
        vec4.transformQuat(position, position, rotation)
        vec3.add(entity._translation, translation, <vec3>position)
        entity.__changedBuffer[0] = 1
    }

    static createEmpty() {
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
    }

    static createMesh(id) {
        const entity = new Entity(undefined, LOCALIZATION_EN.MESH_RENDERER)
        const m = entity.addComponent<MeshComponent>(COMPONENTS.MESH)
        entity.addComponent(COMPONENTS.CULLING)
        m.meshID = id
        EntityConstructor.translateEntity(entity)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createProbe() {
        const entity = new Entity(undefined, LOCALIZATION_EN.SKYLIGHT)
        entity.addComponent(COMPONENTS.SKYLIGHT)
        EntityConstructor.translateEntity(entity)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }


    static createLight(type) {
        const entity = new Entity(undefined, LOCALIZATION_EN.DIRECTIONAL_LIGHT)
        EntityConstructor.translateEntity(entity)
        const comp = entity.addComponent<LightComponent>(COMPONENTS.LIGHT)
        comp.type = type
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createCamera() {
        const entity = new Entity(undefined, LOCALIZATION_EN.CAMERA)
        entity.addComponent(COMPONENTS.CAMERA)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createSprite() {
        const entity = new Entity(undefined, LOCALIZATION_EN.SPRITE_RENDERER)
        entity.addComponent(COMPONENTS.SPRITE)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})

    }

    static toggleEntityVisibility(nodeRef, submit = true) {
        EntityAPI.toggleVisibility(nodeRef)
        if (submit)
            EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
}