import LineAPI from "../../engine-core/lib/rendering/LineAPI";
import GPU from "../../engine-core/GPU";
import STATIC_SHADERS from "../../engine-core/static/resources/STATIC_SHADERS";
import VisibilityRenderer from "../../engine-core/runtime/rendering/VisibilityRenderer";
import STATIC_FRAMEBUFFERS from "../../engine-core/static/resources/STATIC_FRAMEBUFFERS";

const X = new Float32Array([1, 0, 0]), Y = new Float32Array([0, 1, 0]), Z = new Float32Array([0, 0, 1])
let lineShader, lineUniforms

let darker = 0, atOrigin = 0, size = 10000
let finished = true, needsStateUpdate = false
let bufferRes = new Float32Array(2)
export default class LineRenderer{

    static setState(darkerState, atOriginState, sizeState){
        darker = darkerState ? 1 : 0
        size = sizeState
        atOrigin = atOriginState ? 1 : 0
        needsStateUpdate = true
    }

    static initialize(){
        lineShader = GPU.shaders.get(STATIC_SHADERS.DEVELOPMENT.LINE)
        lineUniforms = lineShader.uniformMap

        const FBO = GPU.frameBuffers.get(STATIC_FRAMEBUFFERS.VISIBILITY_BUFFER)
        bufferRes[0] = FBO.width
        bufferRes[1] = FBO.height
    }
    static finish(){
        finished = true
    }
    static #bind(){
        if(finished) {
            lineShader.bind()
            gpu.uniform1i(lineUniforms.darker, darker)
            gpu.uniform1f(lineUniforms.size, size)
            gpu.uniform1i(lineUniforms.atOrigin, atOrigin)

            gpu.activeTexture(gpu.TEXTURE0)
            gpu.bindTexture(gpu.TEXTURE_2D, VisibilityRenderer.depthSampler)
            gpu.uniform1i(lineUniforms.depthSampler, 0)
            gpu.uniform2fv(lineUniforms.bufferResolution, bufferRes)

            finished = false
        }else if(needsStateUpdate){
            gpu.uniform1i(lineUniforms.darker, darker)
            gpu.uniform1f(lineUniforms.size, size)
            gpu.uniform1i(lineUniforms.atOrigin, atOrigin)
            needsStateUpdate = false
        }
    }
    static drawX(matrix){
        LineRenderer.#bind()
        gpu.uniform3fv(lineUniforms.axis, X)
        gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
        LineAPI.drawX()
    }
    static drawY(matrix){
        LineRenderer.#bind()
        gpu.uniform3fv(lineUniforms.axis, Y)
        gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
        LineAPI.drawY()
    }
    static drawZ(matrix){
        LineRenderer.#bind()
        gpu.uniform3fv(lineUniforms.axis, Z)
        gpu.uniformMatrix4fv(lineUniforms.transformMatrix, false, matrix)
        LineAPI.drawZ()
    }
}