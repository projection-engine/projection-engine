import * as shaderCode from "../shaders/SKYBOX.glsl"
import ShaderInstance from "../../engine/libs/instances/ShaderInstance"
import {mat4} from "gl-matrix"
import Renderer from "../../engine/Renderer";


export default class BackgroundSystem {
    constructor() {
        this.shader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment)
        this.projection=  mat4.perspective([], 1.57, 1, .1, 1000)
    }

    execute(data, options) {

        const {camera, gamma, background} = options
        if(background) {
            window.gpu.depthMask(false)
            this.shader.use()

            Renderer.cubeBuffer.enable()
            this.shader.bindForUse({
                projectionMatrix: this.projection,
                viewMatrix: camera.viewMatrix,
                gamma: gamma
            })

            window.gpu.drawArrays(window.gpu.TRIANGLES, 0, 36)
            Renderer.cubeBuffer.disable()

            window.gpu.depthMask(true)
        }
    }
}