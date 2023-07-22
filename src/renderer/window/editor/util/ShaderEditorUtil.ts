import Canvas from "../views/shader-editor/libs/Canvas"
import ShaderNode from "../views/shader-editor/templates/ShaderNode"
import ShaderComment from "../views/shader-editor/templates/ShaderComment"
import OpenFile from "../views/shader-editor/static/OPEN_FILE"
import EditorFSUtil from "./EditorFSUtil"
import FileSystemUtil from "../../shared/FileSystemUtil"
import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools"
import ShaderLink from "../views/shader-editor/templates/ShaderLink"
import CanvasResources from "../views/shader-editor/libs/CanvasResources"
import DraggableNodeUtils from "../views/shader-editor/libs/DraggableNodeUtils"
import {Output} from "../views/shader-editor/static/Output"
import {Input} from "../views/shader-editor/static/Input"
import CanvasRenderer from "../views/shader-editor/libs/CanvasRenderer"
import DATA_TYPES from "../../../engine/core/static/DATA_TYPES"
import Draggable from "../views/shader-editor/templates/Draggable"
import ContextMenuService from "../../shared/lib/context-menu/ContextMenuService"

export default class ShaderEditorUtil{
	static  addComment(canvasAPI: Canvas) {
		let smallestX: number | undefined,
			smallestY: number | undefined,
			biggestX: number | undefined,
			biggestY: number | undefined


		canvasAPI.selectionMap
			.forEach(n => {
				if (n instanceof ShaderComment)
					return
				if (!smallestX || n.x < smallestX)
					smallestX = n.x
				if (!smallestY || n.y < smallestY)
					smallestY = n.y

				if (!biggestX || n.x + n.width > biggestX)
					biggestX = n.x + n.width
				if (!biggestY || n.y + n.height > biggestY)
					biggestY = n.y + n.height
			})

		smallestX -= 4
		smallestY -= 36

		const comment = new ShaderComment(Math.max(smallestX, 0), Math.max(smallestY, 0))
		comment.width = 8 + (biggestX - smallestX)
		comment.height = 40 + (biggestY - smallestY)
		canvasAPI.addComment(comment)
	}

	static  checkGlslFloat(v) {
		if (typeof v === "string")
			return v
		const str = v.toString()
		if (str.includes("."))
			return str
		if (v < 1)
			return "." + str
		return str + "."
	}

	static  getCanvasZoomEvent(canvasAPI: Canvas ): (this: HTMLCanvasElement, ev: WheelEvent) => void {
		let localScale = 1
		return e => {
			e.preventDefault()
			// @ts-ignore
			if (e.wheelDelta > 0 && localScale < 3)
				localScale += localScale * .1
			// @ts-ignore
			else if (e.wheelDelta < 0 && localScale >= .5)
				localScale -= localScale * .1

			CanvasResources.scale = localScale
			canvasAPI.canvas.style.backgroundSize = `${20 * localScale}px ${20 * localScale}px`
			canvasAPI.clear()
		}
	}
	static getMousedownEvent(canvasAPI: Canvas): (this: HTMLCanvasElement, ev: WheelEvent) => void {
		const nodesOnDrag: { onMouseUp: Function, onMouseMove: Function, node: Draggable }[] = []
		const IO: { node: ShaderNode | undefined, output: Output | undefined } = {node: undefined, output: undefined}
		const parentElement = canvasAPI.canvas.parentElement
		const tempLink = {x: 0, y: 0, x1: 0, y1: 0}
		let isOnScroll = false
		let parentBBox: MutableObject
		const initialClick = {x: 0, y: 0}


		const handleMouseMove = (event) => {
			if (!canvasAPI.openFile)
				return
			if (isOnScroll) {
				ContextMenuService.getInstance().blockContext = !ShaderEditorUtil.#checkOffset(event, initialClick)
				parentElement.scrollTop -= event.movementY
				parentElement.scrollLeft -= event.movementX
			} else {
				const S = nodesOnDrag.length
				if (IO.node !== undefined)
					CanvasRenderer.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
				else if (S > 0) {
					for (let i = 0; i < S; i++)
						nodesOnDrag[i].onMouseMove(event)
					canvasAPI.clear()
				}
			}
		}

		return (mouseDownEvent: MouseEvent) => {
			if (mouseDownEvent.target !== canvasAPI.canvas)
				return
			initialClick.x = mouseDownEvent.clientX
			initialClick.y = mouseDownEvent.clientY
			const BBox = canvasAPI.canvas.getBoundingClientRect()
			parentBBox = parentElement.getBoundingClientRect()
			isOnScroll = mouseDownEvent.button === 2
			ContextMenuService.getInstance().blockContext = false

			if (!isOnScroll)
				ShaderEditorUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseDownEvent)
			document.addEventListener("mousemove", handleMouseMove)
			document.addEventListener("mouseup", mouseUpEvent => {
				if (IO.node !== undefined) ShaderLink.handleLink(canvasAPI, mouseUpEvent, BBox.x, BBox.y, IO.node, IO.output)

				if (isOnScroll && ShaderEditorUtil.#checkOffset(mouseUpEvent, initialClick))
					ShaderEditorUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseUpEvent)
				IO.node = undefined
				IO.output = undefined
				tempLink.x = tempLink.y = tempLink.x1 = tempLink.y1 = 0

				for (let i = 0; i < nodesOnDrag.length; i++) {
					nodesOnDrag[i].node.isOnDrag = false
					nodesOnDrag[i].onMouseUp()
				}
				nodesOnDrag.length = 0
				document.removeEventListener("mousemove", handleMouseMove)
				canvasAPI.clear()
				canvasAPI.canvas.style.cursor = "default"
			}, {once: true})
		}
	}

	static #checkOffset(ev1: MouseEvent, ev2: { x: number, y: number }): boolean {
		return Math.abs(ev1.clientX - ev2.x) < 10 && Math.abs(ev1.clientY - ev2.y) < 10
	}

	static getNewVector(value, v, index, type) {
		switch (type) {
		case  DATA_TYPES.VEC2:
			return [index === 0 ? v : value[0], index === 1 ? v : value[1]]
		case  DATA_TYPES.VEC3:
			return [
				index === 0 ? v : value[0],
				index === 1 ? v : value[1],
				index === 2 ? v : value[2]
			]
		case  DATA_TYPES.VEC4:
			return [
				index === 0 ? v : value[0],
				index === 1 ? v : value[1],
				index === 2 ? v : value[2],
				index === 3 ? v : value[3]
			]
		default:
			return value
		}
	}
	static onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI:Canvas, parentBBox, parentElement:HTMLElement, event:MouseEvent){

		const N = canvasAPI.nodes
		const C = canvasAPI.comments
		const X = (event.clientX - BBox.x) / CanvasResources.scale
		const Y = (event.clientY - BBox.y) / CanvasResources.scale

		if (!event.ctrlKey) {
			canvasAPI.lastSelection = undefined
			canvasAPI.selectionMap.clear()
		} else
			canvasAPI.selectionMap.forEach(node => {
				nodesOnDrag.push(DraggableNodeUtils.drag(event, node, parentBBox,true))
			})

		let wasBroken = false
		for (let i = N.length - 1; i >= 0; i--) {
			const node = N[i]
			const onBody = node.checkBodyClick(X, Y)
			const onHeader = node.checkHeaderClick(X, Y)
			if (onHeader || onBody) {
				canvasAPI.selectionMap.set(node.id, node)
				canvasAPI.lastSelection = node
				if (onHeader) {
					nodesOnDrag.push(DraggableNodeUtils.drag(event, node, parentBBox,true))
					node.isOnDrag = true
				} else if (!event.ctrlKey) {
					const isOnScale = node.checkAgainstScale(X, Y)
					if (isOnScale) {
						nodesOnDrag.push(DraggableNodeUtils.drag(event, node, parentBBox,false))
						node.isOnDrag = true
					} else {
						const output = node.checkAgainstIO<Output>(X, Y)
						if (output) {
							IO.node = node
							IO.output = output
							const position = DraggableNodeUtils.getIOPosition(node.output.indexOf(output), node, true)
							tempLink.x = position.x
							tempLink.y = position.y
						} else {
							const input = node.checkAgainstIO<Input>(X, Y, true)
							if (!input)
								break
							const F = canvasAPI.links.findIndex(l => l.targetRef === input)
							if (F === -1)
								break
							const found = canvasAPI.links[F]
							const originalPosition = DraggableNodeUtils.getIOPosition(found.sourceNode.output.indexOf(found.sourceRef), found.sourceNode, true)
							IO.node = found.sourceNode
							IO.output = found.sourceRef

							canvasAPI.removeLink(F)

							tempLink.x = originalPosition.x
							tempLink.y = originalPosition.y
							CanvasRenderer.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
						}
					}
				}

				wasBroken = true
				break
			}
		}

		if (!wasBroken)
			for (let i = C.length - 1; i >= 0; i--) {
				const comment = C[i]
				const onBody = comment.checkBodyClick(X, Y)
				const onHeader = comment.checkHeaderClick(X, Y)
				if (onHeader || onBody) {
					if (onHeader) {
						nodesOnDrag.push(DraggableNodeUtils.drag(event, comment, parentBBox,true))
						comment.isOnDrag = true
					} else if (!event.ctrlKey) {
						const isOnScale = comment.checkAgainstScale(X, Y)
						if (isOnScale) {
							nodesOnDrag.push(DraggableNodeUtils.drag(event, comment, parentBBox,false))
							comment.isOnDrag = true
						}
					}
					canvasAPI.selectionMap.set(comment.id, comment)
					canvasAPI.lastSelection = comment
					break
				}
			}

		if (nodesOnDrag.length > 0 || IO.node !== undefined)
			canvasAPI.ctx.canvas.style.cursor = "grabbing"
		canvasAPI.clear()
	}

	static async parseFile(openFile: OpenFile, canvasAPI: Canvas) {
		const res = EditorFSUtil.getRegistryEntry(openFile.registryID)
		if (!res)
			return
		const dataToParse = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + res.path, "json")
		if (dataToParse && Object.keys(dataToParse).length > 0) {

			if (dataToParse.nodes)
				for (let i = 0; i < dataToParse.nodes.length; i++) {
					const node = dataToParse.nodes[i]
					const parsed = ShaderEditorTools.parseNode(node)
					if (!parsed)
						continue
					canvasAPI.addNode(parsed, true, true)
				}
			if (dataToParse.comments)
				for (let i = 0; i < dataToParse.comments.length; i++) {
					const node = dataToParse.comments[i]
					const parsed = new ShaderComment(node.x, node.y)
					parsed.color = node.color
					parsed.name = node.name
					parsed.width = node.width
					parsed.height = node.height
					canvasAPI.addComment(parsed, true, true)
				}
			if (dataToParse.links)
				for (let i = 0; i < dataToParse.links.length; i++) {
					try {
						const current = dataToParse.links[i]
						let sourceNode, targetNode
						for (let j = 0; j < canvasAPI.nodes.length; j++) {
							const n = canvasAPI.nodes[j]
							if (n.id === current.sourceNode)
								sourceNode = n
							if (n.id === current.targetNode)
								targetNode = n
							if (targetNode && sourceNode)
								break
						}
						if (!targetNode || !sourceNode)
							continue
						const targetRef = targetNode.inputs.find(i => i.key === current.targetRef)
						const sourceRef = sourceNode.output.find(i => i.key === current.sourceRef)
						const link = new ShaderLink(targetNode, sourceNode, targetRef, sourceRef)

						canvasAPI.addLink(link, true)
					} catch (err) {
						console.error(err)
					}
				}
		}

		canvasAPI.clear()
	}

}