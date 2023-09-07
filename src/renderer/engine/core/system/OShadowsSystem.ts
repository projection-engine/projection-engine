import {mat4, vec3} from "gl-matrix"
import ShadowProbe from "@engine-core/lib/resources/ShadowProbe"
import GPUState from "../states/GPUState"
import StaticShadersState from "../states/StaticShadersState"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import loopMeshes from "./loop-meshes"
import Mesh from "@engine-core/lib/resources/Mesh"
import AbstractSystem from "../AbstractSystem";
import EngineState from "../states/EngineState";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import Material from "@engine-core/lib/resources/Material";

const cacheVec3 = vec3.create()
const cacheViewMatrix = mat4.create()
let cacheProjection
let currentEntity
export default class OShadowsSystem extends AbstractSystem {
    static #MAX_CUBEMAPS = 2
    shadowMap?: ShadowProbe
    sampler?: WebGLTexture
    static #CUBE_MAP_VIEWS = {
        target: [
            [1., 0., 0.],
            [-1., 0., 0.],
            [0., 1., 0.],
            [0., -1., 0.],
            [0., 0., 1.],
            [0., 0., -1.],
        ],
        up: [
            [0., -1., 0.],
            [0., -1., 0.],
            [0., 0., 1.],
            [0., 0., -1.],
            [0., -1., 0.],
            [0., -1., 0.],
        ]
    }

    constructor() {
        super()
        this.shadowMap = new ShadowProbe(512)
        this.sampler = this.shadowMap.texture
    }

    static getSampler(): WebGLTexture {
        return this.get<OShadowsSystem>().sampler
    }

     shouldExecute = (): boolean =>  {
        return EngineState.omnidirectionalLightsToUpdate.length > 0;
    }

     execute = () => {
        GPUState.context.cullFace(GPUState.context.BACK)
        GPUState.context.viewport(0, 0, 512, 512)
        for (let i = 0; i < OShadowsSystem.#MAX_CUBEMAPS; i++) {
            const current = EngineState.omnidirectionalLightsToUpdate[i]
            if (!current)
                continue
            currentEntity = current.entity
            this.shadowMap
                .draw((yaw, pitch, perspective, index) => {
                        vec3.add(cacheVec3, currentEntity._translation, <vec3>OShadowsSystem.#CUBE_MAP_VIEWS.target[index])
                        mat4.lookAt(cacheViewMatrix, currentEntity._translation, cacheVec3, <vec3>OShadowsSystem.#CUBE_MAP_VIEWS.up[index])
                        cacheProjection = perspective
                        loopMeshes(this.#loop)
                    },
                    current.zFar,
                    current.zNear
                )
        }
        EngineState.omnidirectionalLightsToUpdate.length = 0
        MetricsManager.currentState = METRICS_FLAGS.OMNIDIRECTIONAL_SHADOWS
    }

    #loop(entity: EngineEntity, mesh: Mesh, material: Material, transformComponent: TransformationComponent, cullingComponent: CullingComponent) {
        if (material?.renderingMode === MATERIAL_RENDERING_TYPES.SKY)
            return
        vec3.sub(cacheVec3, transformComponent.absoluteTranslation, transformComponent.absoluteTranslation)
        const distanceFromLight = vec3.length(cacheVec3)
        if (distanceFromLight > currentEntity.lightComponent.cutoff)
            return
        StaticShadersState.omniDirectShadows.bindForUse({
            farPlane: currentEntity.lightComponent.zFar,
            viewMatrix: cacheViewMatrix,
            transformMatrix: transformComponent.matrix,
            projectionMatrix: cacheProjection,
            lightPosition: transformComponent.absoluteTranslation
        })
        mesh.draw()
    }
}
