import Engine from "../../../../public/engine/Engine";
import {vec3, vec4} from "gl-matrix";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import GPU from "../../../../public/engine/GPU";

let shader, uniforms
export default class GridSystem {
    static shader
    static buffer = vec4.create()
    static metadataBuffer = vec3.create()

    static initialize() {
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.GRID)
        uniforms = shader.uniformMap
    }

    static execute() {
        if (!Engine.params.gridVisibility)
            return
        shader.bind()
        gpu.uniform4fv(uniforms.settings,GridSystem.buffer )
        gpu.uniform3fv(uniforms.visualSettings,GridSystem.metadataBuffer )
        drawQuad()
    }
}