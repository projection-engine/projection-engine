import * as shaderCode from "../shaders/SKYBOX.glsl"
import System from "../../engine/basic/System"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import {mat4} from "gl-matrix"


export default class BackgroundSystem extends System {
    constructor(
    ) {
        super()
        this.shader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment)
        this.projection=  mat4.perspective([], 1.57, 1, .1, 1000)
    }

    execute(data, options) {
        const {cubeBuffer} = data
        const {camera, gamma} = options
        
        window.gpu.depthMask(false)
        this.shader.use()

        cubeBuffer.enable()
        this.shader.bindForUse({
            projectionMatrix: this.projection,
            viewMatrix: camera.viewMatrix,
            gamma: gamma
        })

        window.gpu.drawArrays(window.gpu.TRIANGLES, 0, 36)
        cubeBuffer.disable()

        window.gpu.depthMask(true)
        
    }
}