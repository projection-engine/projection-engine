import IO_RADIUS from "../static/IO_RADIUS"
import HEADER_HEIGHT from "../static/HEADER_HEIGHT"
import DATA_TYPES from "../static/DATA_TYPES"
import type Draggable from "../templates/Draggable"
import {Input} from "../static/Input"
import {Output} from "../static/Output"
import type ShaderNode from "../templates/ShaderNode"
import CanvasResources from "./CanvasResources"

const types = {
	vec2: 0,
	vec3: 1,
	vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export default class DraggableNodeUtils {

	static getMinimalType(...typesToCompare): string | undefined {
		const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
		return typesInverted[min]
	}

	static getIOColor(attribute: Output | Input, isSomeoneDisabled: boolean) {
		const type = attribute.type || attribute.accept?.[0]
		switch (type) {
		case DATA_TYPES.VEC2:
		case DATA_TYPES.COLOR:
		case DATA_TYPES.VEC3:
		case DATA_TYPES.VEC4:
			return `rgba(255,165,0,${isSomeoneDisabled ? .5 : 1})`
		case DATA_TYPES.TEXTURE:
			return `rgba(138,43,226, ${isSomeoneDisabled ? .5 : 1})`
		case DATA_TYPES.ANY:
			return `rgba(255,255,255, ${isSomeoneDisabled ? .5 : 1})`
		default:
			return `rgba(153,153,153, ${isSomeoneDisabled ? .5 : 1})`
		}
	}

	static getIOPosition(index: number, node: ShaderNode, asOutput: boolean): { x: number, y: number, height: number, width: number, rowY: number } {
		const xN = node.x, yN = node.y, w = node.width
		const H = HEADER_HEIGHT - 5
		const Y = yN + H * (index + 2)
		const xIO = !asOutput ? xN : xN + w
		const yIO = Y - IO_RADIUS


		return {x: xIO, y: yIO, height: H, width: w, rowY: Y}
	}

	static drag(event: MouseEvent, node: Draggable, parentBbox, asPositionChange: boolean): { onMouseUp: Function, onMouseMove: Function, node: Draggable } {
		const bounding = {
			x: !asPositionChange ? 0 : node.x * CanvasResources.scale - event.clientX,
			y: !asPositionChange ? 0 : node.y * CanvasResources.scale - event.clientY
		}
		if (!asPositionChange) {
			bounding.x -= parentBbox.left
			bounding.y -= parentBbox.top
		}

		return {
			node: node,
			onMouseUp: () => {
				if (!asPositionChange)
					return
				if (node.y < 0)
					node.y = 0
				if (node.x < 0)
					node.x = 0
				if (node.y > CanvasResources.height)
					node.y = CanvasResources.height - node.height
				if (node.x > CanvasResources.width)
					node.x = CanvasResources.width - node.width
			},
			onMouseMove: ev => {
				let X = Math.round(((ev.clientX + bounding.x) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
				let Y = Math.round(((ev.clientY + bounding.y) / CanvasResources.scale) / CanvasResources.grid) * CanvasResources.grid
				if (asPositionChange) {
					node.x = X
					node.y = Y
				} else {
					X -= node.x
					Y -= node.y
					if (X > node.minWidth)
						node.width = X
					if (Y > node.minHeight)
						node.height = Y

				}

			}
		}
	}
}