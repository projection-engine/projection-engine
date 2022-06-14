import * as shaderCode from "../shaders/SKYBOX.glsl"
import System from "../../engine/basic/System"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import {mat4} from "gl-matrix"


export default class BackgroundSystem extends System {
    constructor(gpu) {
        super()
        this.gpu = gpu
        this.shader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment, gpu)
        this.projection=  mat4.perspective([], 1.57, 1, .1, 1000)
    }

    execute(data, options) {
        super.execute()
        const {
            cubeBuffer
        } = data
        const {camera, gamma} = options
        
        this.gpu.depthMask(false)
        this.shader.use()

        cubeBuffer.enable()
        this.shader.bindForUse({
            projectionMatrix: this.projection,
            viewMatrix: camera.viewMatrix,
            gamma: gamma
        })

        this.gpu.drawArrays(this.gpu.TRIANGLES, 0, 36)
        cubeBuffer.disable()

        this.gpu.depthMask(true)
        
    }
}