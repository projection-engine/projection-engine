export default class Icon {
    constructor() {
        this.transformVBO = window.gpu.createBuffer()
    }

    static start(VBO, VAO, shader) {
        window.gpu.bindVertexArray(VAO)
        VBO.enable()
        shader.use()
    }
    static end(VBO) {
        VBO.disable()
        window.gpu.bindVertexArray(null)
        window.gpu.bindBuffer(window.gpu.ARRAY_BUFFER, null)
    }

    updateBuffer(data){
        const gpu = window.gpu
        const temp = new Float32Array(data.flat())
        // for(let i = 0; i < data.length; i++){
        //     for(let j = 0; j < 16; j++)
        //         temp[i+j] = data[i][j]
        // } 
        gpu.bindBuffer(gpu.ARRAY_BUFFER, this.transformVBO)
        gpu.bufferData(gpu.ARRAY_BUFFER, temp, gpu.STREAM_DRAW)

        gpu.enableVertexAttribArray(1)
        gpu.enableVertexAttribArray(2)
        gpu.enableVertexAttribArray(3)
        gpu.enableVertexAttribArray(4)

        gpu.vertexAttribPointer(1, 4, gpu.FLOAT, false, 64, 0)
        gpu.vertexAttribPointer(2, 4, gpu.FLOAT, false, 64, 16)
        gpu.vertexAttribPointer(3, 4, gpu.FLOAT, false, 64, 32)
        gpu.vertexAttribPointer(4, 4, gpu.FLOAT, false, 64, 48)
        gpu.vertexAttribDivisor(1, 1)
        gpu.vertexAttribDivisor(2, 1)
        gpu.vertexAttribDivisor(3, 1)
        gpu.vertexAttribDivisor(4, 1)
    }
    draw(transformations, texture, camera, iconSize, shader) {
        if (transformations.length > 0) {
            this.updateBuffer(transformations)
            shader.bindForUse({
                cameraPosition: camera.position,
                iconSampler: texture,
                viewMatrix: camera.viewMatrix,
                projectionMatrix: camera.projectionMatrix,
                iconSize
            })
            window.gpu.drawArraysInstanced(window.gpu.TRIANGLES, 0, 6, transformations.length)
            window.gpu.bindBuffer(window.gpu.ARRAY_BUFFER, null)
        }
    }
}