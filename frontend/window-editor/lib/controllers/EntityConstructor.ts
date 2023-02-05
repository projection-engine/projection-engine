import COMPONENTS from "../../../../engine-core/static/COMPONENTS";
import {vec3, vec4} from "gl-matrix";
import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";

import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import SettingsStore from "../../../shared/stores/SettingsStore";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";
import MeshComponent from "../../../../engine-core/instances/components/MeshComponent";
import LightComponent from "../../../../engine-core/instances/components/LightComponent";
import HierarchyController from "../../views/hierarchy/lib/HierarchyController";
import EntityManager from "../EntityManager";


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

    static createEmpty(collection?:boolean) {
        const entity = EntityAPI.getNewEntityInstance(undefined, collection)
        entity.name = collection ? LOCALIZATION_EN.NEW_COLLECTION : LOCALIZATION_EN.NEW_ENTITY
        EntityManager.add(entity)
    }

    static createMesh(id) {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.MESH_RENDERER
        const m = entity.addComponent<MeshComponent>(COMPONENTS.MESH)
        entity.addComponent(COMPONENTS.CULLING)
        m.meshID = id
        EntityConstructor.translateEntity(entity)
        EntityManager.add(entity)

    }

    static createProbe() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.LIGHT_PROBE
        entity.addComponent(COMPONENTS.LIGHT_PROBE)
        EntityConstructor.translateEntity(entity)
        EntityManager.add(entity)
    }

    static createAtmosphere() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.ATMOSPHERE_RENDERER
        entity.addComponent(COMPONENTS.ATMOSPHERE)
        EntityConstructor.translateEntity(entity)
        EntityManager.add(entity)
    }

    static createLight(type) {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.DIRECTIONAL_LIGHT
        EntityConstructor.translateEntity(entity)
        const comp = entity.addComponent<LightComponent>(COMPONENTS.LIGHT)
        comp.type = type
        EntityManager.add(entity)
    }

    static createCamera() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.CAMERA
        entity.addComponent(COMPONENTS.CAMERA)
        EntityConstructor.translateEntity(entity)
        EntityManager.add(entity)
    }

    static createUI() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.UI_RENDERER
        entity.addComponent(COMPONENTS.UI)
        EntityConstructor.translateEntity(entity)
        EntityManager.add(entity)
    }

    static createSprite() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.SPRITE_RENDERER
        entity.addComponent(COMPONENTS.SPRITE)
        EntityManager.add(entity)
    }

    static createDecal() {
        const entity = EntityAPI.getNewEntityInstance()
        entity.name = LOCALIZATION_EN.DECAL_RENDERER
        entity.addComponent(COMPONENTS.DECAL)
        EntityManager.add(entity)
    }

    static toggleEntityVisibility(nodeRef, submit = true) {
        EntityAPI.toggleVisibility(nodeRef)
        if (submit)
            HierarchyController.updateHierarchy()
    }
}