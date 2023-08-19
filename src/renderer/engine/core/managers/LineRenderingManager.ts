import VertexBuffer from "@engine-core/lib/resources/VertexBuffer"
import Mesh from "@engine-core/lib/resources/Mesh"
import GPU from "../GPU"
import AbstractSingleton from "@engine-core/AbstractSingleton";

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

        this.#vaoX = GPU.context.createVertexArray()
        GPU.context.bindVertexArray(this.#vaoX)
        this.#vboX = new VertexBuffer(
            0,
            new Float32Array(X),
            GPU.context.ARRAY_BUFFER,
            3,
            GPU.context.FLOAT
        )
        GPU.context.bindVertexArray(null)

        this.#vaoY = GPU.context.createVertexArray()
        GPU.context.bindVertexArray(this.#vaoY)
        this.#vboY = new VertexBuffer(
            0,
            new Float32Array(Y),
            GPU.context.ARRAY_BUFFER,
            3,
            GPU.context.FLOAT
        )
        GPU.context.bindVertexArray(null)

        this.#vaoZ = GPU.context.createVertexArray()
        GPU.context.bindVertexArray(this.#vaoZ)
        this.#vboZ = new VertexBuffer(
            0,
            new Float32Array(Z),
            GPU.context.ARRAY_BUFFER,
            3,
            GPU.context.FLOAT
        )

    }

    static drawX() {
        const instance = this.get<LineRenderingManager>()

        const vbo = instance.#vboX,
            vao = instance.#vaoX

        Mesh.finishIfUsed()

        GPU.context.bindVertexArray(vao)
        vbo.enable()
        GPU.context.drawArrays(GPU.context.LINES, 0, 2)

        GPU.context.bindVertexArray(null)
        vbo.disable()
    }

    static drawY() {
        const instance = this.get<LineRenderingManager>()
        const vbo = instance.#vboY,
            vao = instance.#vaoY


        Mesh.finishIfUsed()

        GPU.context.bindVertexArray(vao)
        vbo.enable()
        GPU.context.drawArrays(GPU.context.LINES, 0, 2)


        GPU.context.bindVertexArray(null)
        vbo.disable()
    }


    static drawZ() {
        const instance = this.get<LineRenderingManager>()

        const vbo = instance.#vboZ,
            vao = instance.#vaoZ

        Mesh.finishIfUsed()

        GPU.context.bindVertexArray(vao)
        vbo.enable()
        GPU.context.drawArrays(GPU.context.LINES, 0, 2)

        GPU.context.bindVertexArray(null)
        vbo.disable()
    }

}
