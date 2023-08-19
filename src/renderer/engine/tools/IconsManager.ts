import AbstractSingleton from "@engine-core/AbstractSingleton";
import DynamicMap from "@engine-core/lib/DynamicMap";
import EntityManager from "@engine-core/managers/EntityManager";
import EditorEntityManager from "./EditorEntityManager";
import {Components, LightTypes, MaterialRenderingTypes} from "@engine-core/engine.enum";
import EngineState from "@engine-core/states/EngineState";
import EngineToolsState from "./EngineToolsState";
import GPUState from "@engine-core/states/GPUState";
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import LightComponent from "@engine-core/lib/components/LightComponent";

export default class IconsManager extends AbstractSingleton {
    #registeredIcons = new DynamicMap<EngineEntity, RegisteredIcon>()

    static getIcons(){
        return this.get<IconsManager>().#registeredIcons.array
    }

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

                const material = meshComponent?.materialID ? GPUState.materials.get(meshComponent?.materialID) : undefined
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
}
