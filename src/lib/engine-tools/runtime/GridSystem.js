import Engine from "../../../../public/engine/Engine";
import {vec3, vec4} from "gl-matrix";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import GPU from "../../../../public/engine/GPU";
import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
import GPUAPI from "../../../../public/engine/lib/rendering/GPUAPI";
import * as GRID from "../shaders/GRID.glsl";

let shader, uniforms, planeMesh, buffer
export default class GridSystem {
    static shader
    static buffer = new Float32Array([.3, 20., 50, 1])

    static initialize() {
        buffer = GridSystem.buffer
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GRID)
        uniforms = shader.uniformMap

        planeMesh = GPU.meshes.get(STATIC_MESHES.PRODUCTION.PLANE)
    }

    static execute() {
        shader.bind()

        gpu.uniform4fv(uniforms.settings, buffer)

        gpu.disable(gpu.CULL_FACE)
        planeMesh.draw()
        gpu.enable(gpu.CULL_FACE)
    }
}