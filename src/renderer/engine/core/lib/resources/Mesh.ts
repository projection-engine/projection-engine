import VertexBuffer from "./VertexBuffer"

import GPUState from "../../states/GPUState"
import GPUManager from "../../managers/GPUManager"
import EngineState from "../../states/EngineState";

export default class Mesh implements IGPUResource{
	readonly verticesQuantity:number
	readonly trianglesQuantity:number
	readonly id: string
	readonly maxBoundingBox: number[]
	readonly minBoundingBox: number[]
	readonly VAO: WebGLVertexArrayObject
	readonly indexVBO?:WebGLBuffer
	readonly vertexVBO?:VertexBuffer
	readonly normalVBO?:VertexBuffer
	readonly uvVBO?:VertexBuffer

	lastUsed = 0
	loaded = false

	constructor(attributes:MeshProps) {
		const {
			id = crypto.randomUUID(),
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

	static finishIfUsed() {
		const lastUsed = GPUState.activeMesh
		if (lastUsed != null)
			lastUsed.finish()
	}

	bindEssentialResources() {
		const last = GPUState.activeMesh
		if (last === this)
			return
		// else if (last != null)
		//     last.finish()

		GPUState.activeMesh = this
		GPUState.context.bindVertexArray(this.VAO)
		GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, this.indexVBO)
		this.vertexVBO.enable()

	}

	bindAllResources() {
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

	finish() {
		GPUState.context.bindBuffer(GPUState.context.ELEMENT_ARRAY_BUFFER, null)
		this.vertexVBO.disable()

		if (this.uvVBO)
			this.uvVBO.disable()
		if (this.normalVBO)
			this.normalVBO.disable()

		GPUState.context.bindVertexArray(null)
		GPUState.activeMesh = undefined
	}

	simplifiedDraw() {

		this.bindEssentialResources()
		GPUState.context.drawElements(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

	draw() {
		this.bindAllResources()
		GPUState.context.drawElements(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

	drawInstanced(quantity) {
		this.bindAllResources()
		GPUState.context.drawElementsInstanced(GPUState.context.TRIANGLES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0, quantity)
		this.lastUsed = EngineState.elapsed
	}

	drawLineLoop() {
		this.bindEssentialResources()
		GPUState.context.drawElements(GPUState.context.LINE_LOOP, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

	drawTriangleStrip() {
		this.bindEssentialResources()
		GPUState.context.drawElements(GPUState.context.TRIANGLE_STRIP, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

	drawTriangleFan() {
		this.bindEssentialResources()
		GPUState.context.drawElements(GPUState.context.TRIANGLE_FAN, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

	drawLines() {
		this.bindEssentialResources()
		GPUState.context.drawElements(GPUState.context.LINES, this.verticesQuantity, GPUState.context.UNSIGNED_INT, 0)
		this.lastUsed = EngineState.elapsed
	}

}
//
