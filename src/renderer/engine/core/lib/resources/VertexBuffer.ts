import GPUManager from "../../managers/GPUManager"
import GPUState from "../../states/GPUState"

export default class VertexBuffer  implements IResource {
	private readonly id: WebGLBuffer
	private readonly stride: number
	private readonly index: number
	private readonly type: number
	private readonly size: number
	private readonly normalized: boolean
	length = 0

	constructor(index: number, data, type: number, size: number, dataType: number, normalized?: boolean, renderingType?: number, stride?: number) {
		this.id = GPUManager.createBuffer(type, data, renderingType)

		GPUState.context.vertexAttribPointer(
			index,
			size,
			dataType,
			normalized,
			stride||0,
			0)
		GPUState.context.bindBuffer(type, null)

		this.stride = stride || 0
		this.index = index
		this.type = type
		this.size = size
		this.normalized = normalized

		this.length = data.length
	}

	enable() {
		GPUState.context.enableVertexAttribArray(this.index)
		GPUState.context.bindBuffer(this.type, this.id)
		GPUState.context.vertexAttribPointer(this.index, this.size, this.type, this.normalized, this.stride, 0)
	}

	disable() {
		GPUState.context.disableVertexAttribArray(this.index)
		GPUState.context.bindBuffer(this.type, null)
	}

	delete() {
		GPUState.context.deleteBuffer(this.id)
	}
}
