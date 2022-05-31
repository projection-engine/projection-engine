import {createVAO} from "../engine/utils/utils"
import VBO from "../engine/instances/VBO"
import * as shaderCode from "./shaders/billboard.glsl"
import ShaderInstance from "../engine/instances/ShaderInstance"


export default class Icon {
    constructor(gpu) {
        this.gpu = gpu
        this.shader = new ShaderInstance(shaderCode.vertex, shaderCode.fragment, gpu)
        this.vao = createVAO(gpu)
        this.vertexVBO = new VBO(gpu, 0, new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0]), gpu.ARRAY_BUFFER, 3, gpu.FLOAT, false)

        this._prepareTransforms([])
        this.transformVBO = this.gpu.createBuffer()

    }

    _prepareTransforms(data) {

        this.gpu.bufferData(this.gpu.ARRAY_BUFFER, data, this.gpu.STREAM_DRAW)


        this.gpu.enableVertexAttribArray(1);
        this.gpu.enableVertexAttribArray(2);
        this.gpu.enableVertexAttribArray(3)
        this.gpu.enableVertexAttribArray(4);


        this.gpu.vertexAttribPointer(1, 4, this.gpu.FLOAT, false, 64, 0);
        this.gpu.vertexAttribPointer(2, 4, this.gpu.FLOAT, false, 64, 16);
        this.gpu.vertexAttribPointer(3, 4, this.gpu.FLOAT, false, 64, 32);
        this.gpu.vertexAttribPointer(4, 4, this.gpu.FLOAT, false, 64, 48);
        this.gpu.vertexAttribDivisor(1, 1);
        this.gpu.vertexAttribDivisor(2, 1);
        this.gpu.vertexAttribDivisor(3, 1);
        this.gpu.vertexAttribDivisor(4, 1);
    }

    start() {
        this.gpu.bindVertexArray(this.vao)
        this.vertexVBO.enable()
        this.shader.use()

        this.gpu.bindBuffer(this.gpu.ARRAY_BUFFER, this.transformVBO)
    }

    end() {
        this.vertexVBO.disable()
        this.gpu.bindVertexArray(null);
        this.gpu.bindBuffer(this.gpu.ARRAY_BUFFER, null)
    }

    draw(transformations, texture, camera, iconSize) {
        if (transformations.length > 0) {
            this._prepareTransforms(new Float32Array(transformations.flat()))
            this.shader.bindForUse({
                cameraPosition: camera.position,
                iconSampler: texture,
                viewMatrix: camera.viewMatrix,
                projectionMatrix: camera.projectionMatrix,
                iconSize
            })
            this.gpu.drawArraysInstanced(this.gpu.TRIANGLES, 0, 6, transformations.length)
        }
    }

}