import Entity from "../../public/engine/production/instances/Entity";
import COMPONENTS from "../../public/engine/static/COMPONENTS.json";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import STATIC_TEXTURES from "../../public/engine/static/resources/STATIC_TEXTURES";
import {vec3, vec4} from "gl-matrix";
import Localization from "./Localization";
import EngineStore from "../stores/EngineStore";
import {v4} from "uuid";
import CameraAPI from "../../public/engine/production/apis/CameraAPI";
import {EntityAPI} from "../../public/engine/production";

const translate = key => Localization.PROJECT.VIEWPORT[key]
const addSprite = (entity, img) => {
    const e = entity.addComponent(COMPONENTS.SPRITE)
    e.imageID = img
    e.attributes = [1, 0]
}

export default class EntityConstructor {
    static translateEntity(entity) {
        const position = [0, 0, -10, 1]
        vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
        vec3.add(entity._translation, CameraAPI.translationBuffer, position)
        vec3.add(entity.pivotPoint, CameraAPI.translationBuffer, position)
        entity.__changedBuffer[0] = 1
    }

    static createEmpty() {
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
    }

    static createMesh(id) {
        const entity = new Entity(undefined, translate("MESH_RENDERER"))
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
        const entity = new Entity(undefined, translate("POINT_LIGHT"))
        entity.addComponent(COMPONENTS.POINT_LIGHT)
        addSprite(entity, STATIC_TEXTURES.POINT_LIGHT)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createDirectionalLight() {
        const entity = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))
        addSprite(entity, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
        EntityConstructor.translateEntity(entity)
        entity.addComponent(COMPONENTS.DIRECTIONAL_LIGHT)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createCamera() {
        const entity = new Entity(undefined, translate("CAMERA"))
        entity.addComponent(COMPONENTS.CAMERA)
        EntityConstructor.translateEntity(entity)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    static createSprite() {
        const entity = new Entity(undefined, translate("SPRITE_RENDERER"))
        entity.addComponent(COMPONENTS.SPRITE)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})

    }

    static hideEntity(nodeRef, submit = true) {
        const loopHierarchy = (entity, newValue) => {
            for (let i = 0; i < entity.children.length; i++)
                loopHierarchy(entity.children[i], newValue)
            entity.active = newValue
        }
        loopHierarchy(nodeRef, !nodeRef.active)
        EntityAPI.packageLights(false, false)
        if (submit)
            EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
}