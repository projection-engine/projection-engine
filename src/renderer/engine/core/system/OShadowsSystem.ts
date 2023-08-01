import {mat4, vec3} from "gl-matrix"
import CUBE_MAP_VIEWS from "../static/CUBE_MAP_VIEWS"
import ShadowProbe from "../instances/ShadowProbe"
import LightComponent from "../instances/components/LightComponent"
import GPU from "../GPU"
import StaticShaders from "../lib/StaticShaders"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import loopMeshes from "./loop-meshes"
import Entity from "../instances/Entity"
import Mesh from "../instances/Mesh"
import AbstractSystem from "../AbstractSystem";

const cacheVec3 = vec3.create()
const cacheViewMatrix = mat4.create()
let cacheProjection
let currentEntity
let lightsToUpdate: LightComponent[]
export default class OShadowsSystem extends AbstractSystem {
    changed = false
    maxCubeMaps = 2
    shadowMap?: ShadowProbe
    sampler?: WebGLTexture
    lightsToUpdate: LightComponent[] = []

    constructor() {
        super()
        this.shadowMap = new ShadowProbe(512)
        this.sampler = this.shadowMap.texture
        lightsToUpdate = this.lightsToUpdate
    }

    static getSampler(): WebGLTexture {
        return this.get<OShadowsSystem>().sampler
    }

    shouldExecute(): boolean {
        return this.changed || lightsToUpdate.length > 0;
    }

    execute() {
        GPU.context.cullFace(GPU.context.BACK)
        GPU.context.viewport(0, 0, 512, 512)
        for (let i = 0; i < this.maxCubeMaps; i++) {
            const current = lightsToUpdate[i]
            if (!current)
                continue
            currentEntity = current.entity
            this.shadowMap
                .draw((yaw, pitch, perspective, index) => {
                        vec3.add(cacheVec3, currentEntity._translation, <vec3>CUBE_MAP_VIEWS.target[index])
                        mat4.lookAt(cacheViewMatrix, currentEntity._translation, cacheVec3, <vec3>CUBE_MAP_VIEWS.up[index])
                        cacheProjection = perspective
                        loopMeshes(this.#loopCallback)
                    },
                    current.zFar,
                    current.zNear
                )
        }
        this.changed = false
        lightsToUpdate.length = 0
        MetricsController.currentState = METRICS_FLAGS.OMNIDIRECTIONAL_SHADOWS
    }

    #loopCallback(entity: Entity, mesh: Mesh) {
        const meshComponent = entity.meshComponent
        if (!meshComponent.castsShadows || !entity.active || entity.materialRef?.renderingMode === MATERIAL_RENDERING_TYPES.SKY)
            return
        vec3.sub(cacheVec3, entity.absoluteTranslation, entity.absoluteTranslation)
        const distanceFromLight = vec3.length(cacheVec3)
        if (distanceFromLight > currentEntity.lightComponent.cutoff)
            return
        StaticShaders.omniDirectShadows.bindForUse({
            farPlane: currentEntity.lightComponent.zFar,
            viewMatrix: cacheViewMatrix,
            transformMatrix: entity.matrix,
            projectionMatrix: cacheProjection,
            lightPosition: entity.absoluteTranslation
        })
        mesh.draw()
    }
}
