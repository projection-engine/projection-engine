import CanvasRenderer from "./CanvasRenderer"
import OpenFile from "../static/OPEN_FILE"
import type ShaderNode from "../templates/ShaderNode"
import CanvasResources from "./CanvasResources"
import type ShaderLink from "../templates/ShaderLink"
import type ShaderComment from "../templates/ShaderComment"
import NodesIndex from "../static/NODE_MAP"
import NODE_MAP from "../static/NODE_MAP"
import DynamicMap from "../../../../../engine/core/resource-libs/DynamicMap"
import ShaderEditorActionHistory from "./ShaderEditorActionHistory"
import ShaderEditorUtil from "../../../util/ShaderEditorUtil"

export default class Canvas {
	#initialized = false
	openFile?: OpenFile
	#nodes = new DynamicMap<string, ShaderNode>()
	#hasMaterial = false
	history = new ShaderEditorActionHistory()

	get nodes(): ShaderNode[] {
		return this.#nodes.array
	}

	links: ShaderLink[] = []
	comments: ShaderComment[] = []

	ctx?: CanvasRenderingContext2D
	canvas?: HTMLCanvasElement

	lastSelectionListener?: Function
	selectionMap = new Map<string, ShaderNode | ShaderComment>()
	#lastSelection: ShaderNode | ShaderComment | undefined

	constructor() {
		this.history.canvas = this
	}

	addComment(comment: ShaderComment, noSerialization?: boolean, noUpdate?: boolean) {
		if (!noSerialization) {
			this.history.save([comment], true)
			this.history.save([comment])
		}
		this.comments.push(comment)
		if (!noUpdate)
			this.clear()
	}

	removeComments(toRemove: string[], noSerialization?: boolean) {
		if (!noSerialization) {
			const mapped = this.comments.filter(e => toRemove.includes(e.id))
			this.history.save(mapped)
			this.history.save(mapped, true)
		}
		toRemove.forEach(id => {
			const index = this.comments.findIndex(c => c.id == id)
			if (index > -1)
				this.comments.splice(index, 1)
		})
		this.clear()
	}

	addLink(link: ShaderLink, noUpdate?: boolean) {
		const foundExisting = this.links.findIndex(l => l.targetRef === link.targetRef)
		if (foundExisting > -1)
			this.links[foundExisting] = link
		else
			this.links.push(link)
		if (!noUpdate)
			this.clear()
	}

	removeLink(index: number) {
		this.links.splice(index, 1)
		this.clear()
	}

	get lastSelection() {
		return this.#lastSelection
	}

	set lastSelection(data: ShaderNode | ShaderComment | undefined) {
		this.#lastSelection = data
		this.lastSelectionListener?.()
	}

	addNode(node: ShaderNode, noSerialization?: boolean, noUpdate?: boolean) {
		if (!noSerialization) {
			this.history.save([node], true)
			this.history.save([node])
		}
		const isMaterial = node.getSignature() === NODE_MAP.Material.signature
		if (isMaterial && this.#hasMaterial)
			return
		if (isMaterial)
			this.#hasMaterial = true
		this.#nodes.set(node.id, node)
		if (!noUpdate)
			this.clear()
	}

	removeNodes(toRemove: string[], noSerialization?: boolean) {
		if (!noSerialization) {
			const mapped = this.nodes.filter(e => toRemove.includes(e.id))
			this.history.save(mapped)
			this.history.save(mapped, true)
		}
		toRemove.forEach(id => {
			if (!this.#nodes.has(id))
				return
			this.#nodes.delete(id)
			const toRemove = this.links.filter(l => l.sourceNode?.id === id || l.targetNode?.id === id)
			toRemove.forEach(l => {
				this.removeLink(this.links.indexOf(l))
			})
		})
		this.clear()
	}

	clearState() {
		this.history.clear()
		this.#hasMaterial = false
		this.links.length = 0
		this.comments.length = 0
		this.#nodes.clear()
		this.selectionMap.clear()
		this.lastSelection = undefined
		this.clear()
	}

	updateCanvasSize() {
		this.canvas.width = CanvasResources.width
		this.canvas.height = CanvasResources.height
		this.canvas.style.width = CanvasResources.width + "px"
		this.canvas.style.height = CanvasResources.height + "px"
	}

	onDrop(dataTransfer: string, x: number, y: number) {
		if (!this.openFile)
			return
		const node = new NodesIndex[dataTransfer]()
		if (!node) return
		const parent = this.ctx.canvas.parentElement
		const BC = parent.getBoundingClientRect()
		node.x = Math.round(((x + parent.scrollLeft - BC.left) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
		node.y = Math.round(((y + parent.scrollTop - BC.top) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
		this.addNode(node)
		this.clear()
	}

	initialize(canvas: HTMLCanvasElement) {
		if (this.#initialized)
			return
		this.#initialized = true
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")
		this.updateCanvasSize()
		canvas.addEventListener("contextmenu", e => e.preventDefault())
		canvas.addEventListener("mousedown", ShaderEditorUtil.getMousedownEvent(this))
		canvas.addEventListener("wheel", ShaderEditorUtil.getCanvasZoomEvent(this), {passive: false})

		canvas.addEventListener("drop", ev => this.onDrop(ev.dataTransfer.getData("text"), ev.clientX, ev.clientY))
		this.clear()
	}

	clear() {
		const ctx = this.ctx
		if (!ctx)
			return
		const canvas = this.canvas
		const scale = CanvasResources.scale || .01

		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.setTransform(scale, 0, 0, scale, 0, 0)
		this.draw()
	}


	private draw() {
		const ctx = this.ctx

		const C = this.comments
		const CS = C.length
		for (let i = 0; i < CS; i++) {
			const comment = C[i]
			if (comment.isOnDrag)
				CanvasRenderer.drawNodePosition(ctx, comment)
			comment.draw(ctx, this)
		}

		const L = this.links
		const LS = L.length
		for (let i = 0; i < LS; i++)
			CanvasRenderer.drawLink(ctx, L[i])


		const N = this.nodes
		const NS = N.length
		for (let i = 0; i < NS; i++) {
			const node = N[i]
			if (node.isOnDrag)
				CanvasRenderer.drawNodePosition(ctx, node)
			node.drawToCanvas(ctx, this)
		}
	}
}