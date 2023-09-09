import VertexBuffer from "@engine-core/lib/resources/VertexBuffer"
import GPUState from "../states/GPUState"
import AbstractSingleton from "@engine-core/AbstractSingleton";
import AbstractMesh from "@engine-core/lib/resources/AbstractMesh";

export default class LineRenderingManager extends AbstractSingleton {
    #vaoX: WebGLVertexArrayObject
    #vboX: VertexBuffer
    #vaoY: WebGLVertexArrayObject
    #vboY: VertexBuffer
    #vaoZ: WebGLVertexArrayObject
    #vboZ: VertexBuffer


    constructor() {
        super()
        const X = [0, 0, 0, 1, 0, 0]
        const Y = [0, 0, 0, 0, 1, 0]
        const Z = [0, 0, 0, 0, 0, 1]

        this.#vaoX = GPUState.context.createVertexArray()
        GPUState.context.bindVertexArray(this.#vaoX)
        this.#vboX = new VertexBuffer(
            0,
            new Float32Array(X),
            GPUState.context.ARRAY_BUFFER,
            3,
            GPUState.context.FLOAT
        )
        GPUState.context.bindVertexArray(null)

        this.#vaoY = GPUState.context.createVertexArray()
        GPUState.context.bindVertexArray(this.#vaoY)
        this.#vboY = new VertexBuffer(
            0,
            new Float32Array(Y),
            GPUState.context.ARRAY_BUFFER,
            3,
            GPUState.context.FLOAT
        )
        GPUState.context.bindVertexArray(null)

        this.#vaoZ = GPUState.context.createVertexArray()
        GPUState.context.bindVertexArray(this.#vaoZ)
        this.#vboZ = new VertexBuffer(
            0,
            new Float32Array(Z),
            GPUState.context.ARRAY_BUFFER,
            3,
            GPUState.context.FLOAT
        )

    }

    static drawX() {
        const instance = this.get<LineRenderingManager>()

        const vbo = instance.#vboX,
            vao = instance.#vaoX

        AbstractMesh.finishIfUsed()

        GPUState.context.bindVertexArray(vao)
        vbo.enable()
        GPUState.context.drawArrays(GPUState.context.LINES, 0, 2)

        GPUState.context.bindVertexArray(null)
        vbo.disable()
    }

    static drawY() {
        const instance = this.get<LineRenderingManager>()
        const vbo = instance.#vboY,
            vao = instance.#vaoY


        AbstractMesh.finishIfUsed()

        GPUState.context.bindVertexArray(vao)
        vbo.enable()
        GPUState.context.drawArrays(GPUState.context.LINES, 0, 2)


        GPUState.context.bindVertexArray(null)
        vbo.disable()
    }


    static drawZ() {
        const instance = this.get<LineRenderingManager>()

        const vbo = instance.#vboZ,
            vao = instance.#vaoZ

        AbstractMesh.finishIfUsed()

        GPUState.context.bindVertexArray(vao)
        vbo.enable()
        GPUState.context.drawArrays(GPUState.context.LINES, 0, 2)

        GPUState.context.bindVertexArray(null)
        vbo.disable()
    }

}
