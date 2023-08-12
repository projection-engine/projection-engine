import GPU from "../GPU"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import StaticShaders from "../lib/StaticShaders"
import StaticMeshes from "../lib/StaticMeshes"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import AtmosphereComponent from "../components/AtmosphereComponent"
import {mat4} from "gl-matrix"
import CameraAPI from "../lib/utils/CameraAPI"
import AbstractSystem from "../AbstractSystem";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";

const resources = mat4.create().fill(0)
export default class AtmosphereRendererSystem extends AbstractSystem {

    shouldExecute(): boolean {
        return ResourceEntityMapper.withComponent(Components.ATMOSPHERE).size > 0;
    }

    execute() {
        const entities = ResourceEntityMapper.withComponent(Components.ATMOSPHERE).array
        const size = entities.length
        const context = GPU.context
        StaticShaders.atmosphere.bind()
        context.disable(context.DEPTH_TEST)
        context.uniformMatrix4fv(StaticShaders.atmosphereUniforms.invSkyProjectionMatrix, false, CameraAPI.invSkyboxProjectionMatrix)
        for (let i = 0; i < size; i++) {
            this.#render(entities[i])
        }
        context.enable(context.DEPTH_TEST)
        MetricsController.currentState = METRICS_FLAGS.ATMOSPHERE
    }

    #render(entity: EngineEntity) {
        const uniforms = StaticShaders.atmosphereUniforms
        const context = GPU.context
        const component = EntityManager.getComponent<AtmosphereComponent>(entity, Components.ATMOSPHERE)
        if (EntityManager.isEntityEnabled(entity)) {
            AtmosphereRendererSystem.#bindResources(resources, component)
            context.uniform1i(uniforms.type, component.renderingType)
            context.uniformMatrix4fv(uniforms.information, false, resources)
            StaticMeshes.drawQuad()
        }
    }

    static #bindResources(matrix: mat4, component: AtmosphereComponent) {
        matrix[0] = component.sunDirection[0]
        matrix[1] = component.sunDirection[1]
        matrix[2] = component.sunDirection[2]
        matrix[3] = component.betaRayleigh[0] * 263157
        matrix[4] = component.betaRayleigh[1] * 74074
        matrix[5] = component.betaRayleigh[2] * 30211
        matrix[6] = component.betaMie[0] * 476
        matrix[7] = component.betaMie[1] * 476
        matrix[8] = component.betaMie[2] * 476
        matrix[9] = component.intensity
        matrix[10] = component.atmosphereRadius
        matrix[11] = component.planetRadius
        matrix[12] = component.rayleighHeight
        matrix[13] = component.mieHeight
        matrix[14] = component.maxSamples
        matrix[15] = component.threshold
    }
}
