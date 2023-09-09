import VertexBuffer from "@engine-core/lib/resources/VertexBuffer";
import GPUState from "@engine-core/states/GPUState";
import GPUManager from "@engine-core/managers/GPUManager";
import EngineState from "@engine-core/states/EngineState";
import UUIDGen from "../../../../../shared/UUIDGen";

export default abstract class AbstractMesh implements IGPUResource {
    verticesQuantity: number
    trianglesQuantity: number
    id: string
    maxBoundingBox: number[]
    minBoundingBox: number[]
    VAO: WebGLVertexArrayObject
    indexVBO?: WebGLBuffer
    vertexVBO?: VertexBuffer
    normalVBO?: VertexBuffer
    uvVBO?: VertexBuffer
    lastUsed = 0
    loaded = false

    constructor(attributes: MeshProps) {
        const {
            id = UUIDGen(),
            vertices,
            indices,
            normals,
            uvs,
            maxBoundingBox,
            minBoundingBox
        } = attributes

        this.id = id
        this.maxBoundingBox = maxBoundingBox
        this.minBoundingBox = minBoundingBox
        const l = indices.length
        this.trianglesQuantity = l / 3
        this.verticesQuantity = l

        this.VAO = GPUState.context.createVertexArray()
        GPUState.context.bindVertexArray(this.VAO)

        this.indexVBO = GPUManager.createBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices))
        this.vertexVBO = new VertexBuffer(0, new Float32Array(vertices), GPUState.context.ARRAY_BUFFER, 3, GPUState.context.FLOAT, false, undefined, 0)

        if (uvs && uvs.length > 0)
            this.uvVBO = new VertexBuffer(1, new Float32Array(uvs), GPUState.context.ARRAY_BUFFER, 2, GPUState.context.FLOAT, false, undefined, 0)

        if (normals && normals.length > 0)
            this.normalVBO = new VertexBuffer(2, new Float32Array(normals), GPUState.context.ARRAY_BUFFER, 3, GPUState.context.FLOAT, false, undefined, 0)

        GPUState.context.bindVertexArray(null)
        GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, null)
        this.loaded = true
        this.lastUsed = EngineState.elapsed
    }

    protected bindAllResources() {
        const last = GPUState.activeMesh
        if (last === this)
            return
        GPUState.activeMesh = this
        GPUState.context.bindVertexArray(this.VAO)
        GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, this.indexVBO)
        this.vertexVBO.enable()
        if (this.normalVBO)
            this.normalVBO.enable()
        if (this.uvVBO)
            this.uvVBO.enable()
    }


    protected finish() {
        GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, null)
        this.vertexVBO.disable()

        if (this.uvVBO)
            this.uvVBO.disable()
        if (this.normalVBO)
            this.normalVBO.disable()

        GPUState.context.bindVertexArray(null)
        GPUState.activeMesh = undefined
    }

    static finishIfUsed() {
        const lastUsed = GPUState.activeMesh
        if (lastUsed != null)
            lastUsed.finish()
    }
}
