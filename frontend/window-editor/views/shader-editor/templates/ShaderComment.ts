import type ShaderNode from "./ShaderNode"
import type Canvas from "../libs/Canvas"
import CanvasRenderer from "../libs/CanvasRenderer"
import Draggable from "./Draggable"


export default class ShaderComment extends Draggable {
	name = "New Comment"
	color = [150, 150, 150]
	nodeIDs = []
	#nodes = []


	constructor(x: number, y: number) {
		super()
		this.x = x
		this.y = y

		this.height = 200
	}

	get nodes() {
		return this.#nodes
	}

	addNodes(node: ShaderNode, canvasAPI: Canvas) {
		if (node.targetCommentID) {
			const oldComment = canvasAPI.comments.find(c => c.id === node.targetCommentID)
			oldComment?.removeNode?.(node)
		}
		node.targetCommentID = this.id
		this.#nodes.push(node)
		this.nodeIDs.push(node.id)
	}

	removeNode(node: ShaderNode) {
		const index = this.nodeIDs.indexOf(node.id)
		if (index === -1)
			return
		node.targetCommentID = undefined
		this.#nodes.splice(index, 1)
		this.nodeIDs.splice(index, 1)
	}

	checkAgainstNode(node: ShaderNode, canvasAPI: Canvas) {
		const startX = node.x
		const endX = node.x + node.width
		const startY = node.y
		const endY = node.y + node.height

		if ((startX >= this.x && endX <= this.x + this.width) && (startY >= this.y && endY <= this.y + this.height)) {
			this.addNodes(node, canvasAPI)
		}
	}

	draw(ctx: CanvasRenderingContext2D, canvasAPI: Canvas) {
		CanvasRenderer.drawRoundedRect(ctx, this, 3, canvasAPI.selectionMap.get(this.id) !== undefined, canvasAPI.lastSelection === this, `rgba(${this.color}, .5)`)
		CanvasRenderer.drawNodeHeader(ctx, this)
		this.drawScale(ctx)
	}
}