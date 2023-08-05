import GPU from "../GPU"
import ResourceEntityMapper from "../resource-libs/ResourceEntityMapper"
import StaticShaders from "../lib/StaticShaders"
import StaticMeshes from "../lib/StaticMeshes"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import AtmosphereComponent from "../components/AtmosphereComponent"
import {mat4} from "gl-matrix"
import CameraAPI from "../lib/utils/CameraAPI"
import Entity from "../instances/Entity";
import AbstractSystem from "../AbstractSystem";

const resources = mat4.create().fill(0)
export default class AtmosphereRendererSystem extends AbstractSystem {

    shouldExecute(): boolean {
        return ResourceEntityMapper.atmosphere.size > 0;
    }

    execute() {
        const entities = ResourceEntityMapper.atmosphere.array
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

    #render(entity: Entity) {
        const uniforms = StaticShaders.atmosphereUniforms
        const context = GPU.context
        const component = entity.atmosphereComponent
        if (!entity.active)
            return
        AtmosphereComponent.bindResources(resources, component)
        context.uniform1i(uniforms.type, component.renderingType)
        context.uniformMatrix4fv(uniforms.information, false, resources)

        StaticMeshes.drawQuad()
    }
}
