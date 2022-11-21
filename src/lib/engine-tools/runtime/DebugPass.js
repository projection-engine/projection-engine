import GPU from "../../../../public/engine/GPU";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";

let shader, uniforms
export default class DebugPass {
    static sampler
    static flag

    static initialize() {
        shader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.DEBUG_DEFERRED)
        uniforms = shader.uniformMap
    }

    static execute() {
        if (DebugPass.sampler !== undefined)
            shader.bind()
        gpu.activeTexture(gpu.TEXTURE0)
        gpu.bindTexture(gpu.TEXTURE_2D, DebugPass.sampler)
        gpu.uniform1i(uniforms.uSampler, 0)
        gpu.uniform1i(uniforms.debugFlag, DebugPass.flag)
        drawQuad()
    }


}