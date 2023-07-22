import type ShaderNode from "./ShaderNode"
import type Canvas from "../libs/Canvas"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"

import {Input} from "../static/Input"
import {Output} from "../static/Output"
import CanvasResources from "../libs/CanvasResources"
import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";

export default class ShaderLink {
	targetRef: Input
	sourceRef: Output
	targetNode: ShaderNode
	sourceNode: ShaderNode
	target: string
	source: string
	identifier: string
	targetKey: string
	sourceKey: string
	sourceType: string
	targetType: string

	static getPattern(l) {
		return l.target + "-" + l.source
	}

	constructor(target: ShaderNode, source: ShaderNode, tR: Input, sR: Output) {
		this.targetNode = target
		this.sourceNode = source
		this.targetRef = tR
		this.sourceRef = sR

		this.target = this.targetRef.id + this.targetRef.key
		this.source = this.sourceRef.id + this.sourceRef.key
		this.identifier = ShaderLink.getPattern(this)

		this.targetKey = this.targetRef.key
		this.sourceKey = this.sourceRef.key
		this.sourceType = this.sourceRef.type
		this.targetType = this.targetRef.type
	}

	static handleLink(canvasAPI: Canvas, event: MouseEvent, x: number, y: number, sourceNode: ShaderNode, sourceIO: Output) {
		if (!sourceIO || !sourceNode)
			return
		const N = canvasAPI.nodes
		const X = (event.clientX - x) / CanvasResources.scale
		const Y = (event.clientY - y) / CanvasResources.scale

		for (let i = N.length - 1; i >= 0; i--) {
			const node = N[i]
			const onBody = node.checkBodyClick(X, Y)
			if (onBody) {
				const targetIO = node.checkAgainstIO<Input>(X, Y, true)

				if (targetIO && targetIO.accept.includes(sourceIO.type)) {
					const newLink = new ShaderLink(node, sourceNode, targetIO, sourceIO)
					canvasAPI.addLink(newLink)
				} else if (targetIO)
					ToastNotificationSystem.getInstance().error(LocalizationEN.INVALID_TYPE)
				break
			}
		}
	}
}