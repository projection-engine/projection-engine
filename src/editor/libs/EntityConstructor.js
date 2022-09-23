import Entity from "../../../public/engine/production/instances/Entity";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";
import {vec3} from "gl-matrix";
import Localization from "../../shared/libs/Localization";
import {ConversionAPI} from "../../../public/engine/production";
import {CameraTracker} from "../../../public/engine/editor";

const translate = key => Localization.PROJECT.VIEWPORT[key]
const addSprite = (entity, img) => {
    const e = entity.addComponent(COMPONENTS.SPRITE)
    e.imageID = img
    e.attributes = [1, 0]
}

export default class EntityConstructor {
    static translateEntity(entity) {
        const DISTANCE_FROM_CAMERA = 10
        const cosPitch = Math.cos(CameraTracker.pitch)
        const position = []
        position[0] = DISTANCE_FROM_CAMERA * cosPitch * Math.cos(CameraTracker.yaw)
        position[1] = DISTANCE_FROM_CAMERA * Math.sin(CameraTracker.pitch)
        position[2] = DISTANCE_FROM_CAMERA * cosPitch * Math.sin(CameraTracker.yaw)

        const origin = vec3.add([], CameraTracker.centerOn, position)

        vec3.add(entity._translation, entity._translation, origin)
        entity.__changedBuffer[0] = 1
    }

    static createEmpty(event) {
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createMesh(id, event) {
        const entity = new Entity(undefined, translate("MESH_RENDERER"))
        const m = entity.addComponent(COMPONENTS.MESH)
        m.meshID = id
        EntityConstructor.translateEntity(entity)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createProbe(asDiffuse, event) {
        const entity = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        const p = entity.addComponent(COMPONENTS.PROBE)
        p.specularProbe = !asDiffuse
        addSprite(entity, STATIC_TEXTURES.PROBE)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createPointLight(event) {
        const entity = new Entity(undefined, translate("POINT_LIGHT"))
        entity.addComponent(COMPONENTS.POINT_LIGHT)
        addSprite(entity, STATIC_TEXTURES.POINT_LIGHT)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createDirectionalLight(event) {
        const entity = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))
        addSprite(entity, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
        EntityConstructor.translateEntity(entity)
        entity.addComponent(COMPONENTS.DIRECTIONAL_LIGHT)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createCamera(event) {
        const entity = new Entity(undefined, translate("CAMERA"))
        entity.addComponent(COMPONENTS.CAMERA)
        EntityConstructor.translateEntity(entity)
        entity.scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createSprite(event) {
        const entity = new Entity(undefined, translate("SPRITE_RENDERER"))
        entity.addComponent(COMPONENTS.SPRITE)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
        if (event)
            event.currentTarget.closeDropdown()
    }
}