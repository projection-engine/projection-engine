import Entity from "../../../public/engine/production/instances/Entity";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";
import {vec3} from "gl-matrix";
import Localization from "../../shared/libs/Localization";

const translate = key => Localization.PROJECT.VIEWPORT[key]
const addSprite = (entity, img) => {
    const e = entity.addComponent(COMPONENTS.SPRITE)
    e.imageID = img
    e.attributes = [1, 0]
}

export default class EntityConstructor {
    static createEmpty(event) {
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createMesh(id, event) {
        const actor = new Entity(undefined, translate("MESH_RENDERER"))
        const m = actor.addComponent(COMPONENTS.MESH)
        m.meshID = id
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createProbe(asDiffuse, event) {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        const p = actor.addComponent(COMPONENTS.PROBE)
        p.specularProbe = !asDiffuse
        addSprite(actor, STATIC_TEXTURES.PROBE)
        vec3.copy(actor.translation, window.engineCursor.translation)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createPointLight(event) {
        const actor = new Entity(undefined, translate("POINT_LIGHT"))
        actor.addComponent(COMPONENTS.POINT_LIGHT)
        addSprite(actor, STATIC_TEXTURES.POINT_LIGHT)
        vec3.copy(actor.translation, window.engineCursor.translation)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createDirectionalLight(event) {
        const actor = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))
        addSprite(actor, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
        vec3.copy(actor.translation, window.engineCursor.translation)

        actor.addComponent(COMPONENTS.DIRECTIONAL_LIGHT)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createCamera(event) {
        const actor = new Entity(undefined, translate("CAMERA"))
        actor.addComponent(COMPONENTS.CAMERA)
        vec3.copy(actor.translation, window.engineCursor.translation)
        actor.scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }

    static createSprite(event) {
        const actor = new Entity(undefined, translate("SPRITE_RENDERER"))
        actor.addComponent(COMPONENTS.SPRITE)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        if (event)
            event.currentTarget.closeDropdown()
    }
}