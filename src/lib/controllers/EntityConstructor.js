import Entity from "../../../public/engine/instances/Entity";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.js";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";
import {vec3, vec4} from "gl-matrix";
import Localization from "../../templates/LOCALIZATION_EN";
import EngineStore from "../../stores/EngineStore";
import {v4} from "uuid";
import CameraAPI from "../../../public/engine/lib/utils/CameraAPI";
import LightsAPI from "../../../public/engine/lib/rendering/LightsAPI";
import SettingsStore from "../../stores/SettingsStore";


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

    static createProbe(asDiffuse) {
        const entity = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        const p = entity.addComponent(COMPONENTS.PROBE)
        p.specularProbe = !asDiffuse
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
        const loopHierarchy = (entity, newValue) => {
            for (let i = 0; i < entity.children.length; i++)
                loopHierarchy(entity.children[i], newValue)
            entity.active = newValue
        }
        loopHierarchy(nodeRef, !nodeRef.active)
        LightsAPI.packageLights(false, false)
        if (submit)
            EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
}