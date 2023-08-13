import AbstractSingleton from "../core/AbstractSingleton";
import DynamicMap from "../core/resource-libs/DynamicMap";
import EditorEntity from "./EditorEntity";
import * as crypto from "crypto";
import EntityManager from "@engine-core/EntityManager";
import LightComponent from "@engine-core/components/LightComponent";
import {Components, LightTypes, MaterialRenderingTypes} from "@engine-core/engine.enum";
import EngineToolsState from "./EngineToolsState";
import MeshComponent from "@engine-core/components/MeshComponent";
import EngineState from "@engine-core/EngineState";
import GPU from "@engine-core/GPU";

export default class EditorEntityManager extends AbstractSingleton {
    #entities = new DynamicMap<EngineEntity, EditorEntity>()
    #registeredIcons = new DynamicMap<EngineEntity, RegisteredIcon>()

    constructor() {
        super();
        EntityManager.addEventListener("hard-change", e => {
            this.#registeredIcons.clear()
            for (let i = 0; i < EntityManager.getEntityIds().length; i++){
                const id = EntityManager.getEntityIds()[i];
                const entity = EditorEntityManager.getEntity(id)
                if(!entity)
                    continue;

                const hasLight = entity.hasComponent(Components.LIGHT)
                const hasProbe = entity.hasComponent(Components.LIGHT_PROBE)
                const hasAtmosphere = entity.hasComponent(Components.ATMOSPHERE)
                const hasDecal = entity.hasComponent(Components.DECAL)
                const hasCamera = entity.hasComponent(Components.CAMERA)
                const hasUI = entity.hasComponent(Components.UI)
                const meshComponent = entity.getComponent<MeshComponent>(Components.MESH)
                const doesntHaveIcon = !hasLight && !hasProbe && !hasCamera && !hasDecal && !hasAtmosphere

                const material = meshComponent?.materialID ? GPU.materials.get(meshComponent?.materialID) : undefined
                if (
                    EngineState.cameraEntityTarget === id ||
                    doesntHaveIcon && hasUI ||
                    meshComponent?.meshID && material?.renderingMode !== MaterialRenderingTypes.SKY ||
                    doesntHaveIcon && meshComponent?.meshID && material?.renderingMode !== MaterialRenderingTypes.SKY ||
                    doesntHaveIcon && !meshComponent?.meshID
                )
                    continue;

                const lightComponent = entity.getComponent<LightComponent>(Components.LIGHT)
                const lightProbeComponent = entity.hasComponent(Components.LIGHT_PROBE)
                const atmosphereComponent = entity.hasComponent(Components.ATMOSPHERE)
                const decalComponent = entity.hasComponent(Components.DECAL)
                const lightType = lightComponent?.type
                let doNotFaceCamera = 0,
                    drawSphere = 0,
                    removeSphereCenter = 0,
                    scale = EngineToolsState.iconScale,
                    imageIndex = 0

                switch (lightType) {
                    case LightTypes.DIRECTIONAL:
                        imageIndex = 1
                        break
                    case LightTypes.POINT:
                        imageIndex = 2
                        break
                    case LightTypes.SPOT:
                        imageIndex = 4
                        break
                    case LightTypes.SPHERE:
                        imageIndex = -1
                        drawSphere = 1
                        scale = lightComponent.areaRadius
                        removeSphereCenter = 0
                        break
                    case LightTypes.DISK:
                        imageIndex = -1
                        doNotFaceCamera = 1
                        drawSphere = 1
                        removeSphereCenter = 1
                        scale = lightComponent.areaRadius
                        break
                }

                if (lightProbeComponent)
                    imageIndex = imageIndex !== 0 ? 0 : 3
                if (atmosphereComponent)
                    imageIndex = imageIndex !== 0 ? 0 : 5
                if (decalComponent)
                    imageIndex = imageIndex !== 0 ? 0 : 6
                this.#registeredIcons.set(id, {
                    entity,
                    scale,
                    imageIndex,
                    doNotFaceCamera,
                    removeSphereCenter,
                    drawSphere,
                })
            }
        })
    }
    static getIcons(){
        return this.getInstance().#registeredIcons.array
    }

    static get entities() {
        return this.get<EditorEntityManager>().#entities
    }

    static getInstance() {
        return this.get<EditorEntityManager>()
    }

    static getEntity(id: EngineEntity) {
        return EditorEntityManager.getInstance().#entities.get(id)
    }

    static create(id?: crypto.UUID): EditorEntity {
        const entity = new EditorEntity(id)
        EntityManager.createEntitiesById([entity.id])
        return entity
    }

    static getEntities() {
        return this.getInstance().#entities
    }

    static serializeState(): string {

    }
}
