export default class Icon {
    constructor(gpu) {
        this.gpu = gpu
        this.transformVBO = this.gpu.createBuffer()
    }

    #prepareTransforms(data) {
        this.gpu.bufferData(this.gpu.ARRAY_BUFFER, data, this.gpu.STREAM_DRAW)

        this.gpu.enableVertexAttribArray(1)
        this.gpu.enableVertexAttribArray(2)
        this.gpu.enableVertexAttribArray(3)
        this.gpu.enableVertexAttribArray(4)

        this.gpu.vertexAttribPointer(1, 4, this.gpu.FLOAT, false, 64, 0)
        this.gpu.vertexAttribPointer(2, 4, this.gpu.FLOAT, false, 64, 16)
        this.gpu.vertexAttribPointer(3, 4, this.gpu.FLOAT, false, 64, 32)
        this.gpu.vertexAttribPointer(4, 4, this.gpu.FLOAT, false, 64, 48)
        this.gpu.vertexAttribDivisor(1, 1)
        this.gpu.vertexAttribDivisor(2, 1)
        this.gpu.vertexAttribDivisor(3, 1)
        this.gpu.vertexAttribDivisor(4, 1)
    }

    static start(VBO, VAO, shader, gpu) {
        gpu.bindVertexArray(VAO)
        VBO.enable()
        shader.use()
    }
    static end(VBO, gpu) {
        VBO.disable()
        gpu.bindVertexArray(null)
        gpu.bindBuffer(gpu.ARRAY_BUFFER, null)
    }
    draw(transformations, texture, camera, iconSize, shader) {
        if (transformations.length > 0) {
            this.gpu.bindBuffer(this.gpu.ARRAY_BUFFER, this.transformVBO)
            this.#prepareTransforms(new Float32Array(transformations.flat()))
            shader.bindForUse({
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