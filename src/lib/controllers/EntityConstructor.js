import Entity from "../../../public/engine/instances/Entity";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.js";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";
import {vec3, vec4} from "gl-matrix";
import Localization from "../../templates/LOCALIZATION_EN";
import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
import EngineStore from "../../stores/EngineStore";
import {v4} from "uuid";
import CameraAPI from "../../../public/engine/lib/utils/CameraAPI";
import SettingsStore from "../../stores/SettingsStore";
import EntityAPI from "../../../public/engine/lib/utils/EntityAPI";


const addSprite = (entity, img) => {
    const e = entity.addComponent(COMPONENTS.SPRITE)
    e.imageID = img
    e.attributes = [1, 0]
}

export default class EntityConstructor {
    static translateEntity(entity, rotation= CameraAPI.rotationBuffer, translation = CameraAPI.translationBuffer) {
        if (SettingsStore.data.spawnOnOrigin) {
            vec3.copy(entity._translation, [0, 0, 0])
            entity.__changedBuffer[0] = 1
            return
        }

        const position = [0, 0, -(SettingsStore.data.spawnDistanceFromCamera || 10), 1]
        vec4.transformQuat(position, position, rotation)
        vec3.add(entity._translation, translation, position)
        entity.__changedBuffer[0] = 1
    }

    static createEmpty() {
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
    }

    static createMesh(id) {
        const entity = new Entity(undefined, Localization.MESH_RENDERER)
        const m = entity.addComponent(COMPONENTS.MESH)
        m.meshID = id
        EntityConstructor.translateEntity(entity)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createProbe() {
        const entity = new Entity(undefined, LOCALIZATION_EN.SKYLIGHT)
        entity.addComponent(COMPONENTS.SKYLIGHT)

        addSprite(entity, STATIC_TEXTURES.PROBE)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createPointLight() {
        const entity = new Entity(undefined, Localization.POINT_LIGHT)
        entity.addComponent(COMPONENTS.POINT_LIGHT)
        addSprite(entity, STATIC_TEXTURES.POINT_LIGHT)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createDirectionalLight() {
        const entity = new Entity(undefined, Localization.DIRECTIONAL_LIGHT)
        addSprite(entity, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
        EntityConstructor.translateEntity(entity)
        entity.addComponent(COMPONENTS.DIRECTIONAL_LIGHT)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createCamera() {
        const entity = new Entity(undefined, Localization.CAMERA)
        entity.addComponent(COMPONENTS.CAMERA)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createSprite() {
        const entity = new Entity(undefined, Localization.SPRITE_RENDERER)
        entity.addComponent(COMPONENTS.SPRITE)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})

    }

    static toggleEntityVisibility(nodeRef, submit = true) {
        EntityAPI.toggleVisibility(nodeRef)
        if (submit)
            EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
}