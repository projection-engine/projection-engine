import IO_RADIUS from "../static/IO_RADIUS"
import HEADER_HEIGHT from "../static/HEADER_HEIGHT"
import type Canvas from "../libs/Canvas"
import Draggable from "./Draggable"
import CanvasRenderer from "../libs/CanvasRenderer"
import {Input} from "../static/Input"
import {Output} from "../static/Output"
import MaterialUniform from "../../../../../engine/core/static/MaterialUniform"
import DraggableNodeUtils from "../libs/DraggableNodeUtils"
import CanvasResources from "../libs/CanvasResources"
import Signature from "./Signature"

export default class ShaderNode extends Draggable implements Signature{
    [key: string]: any
    static signature = "ShaderNode"
    getSignature():string{
    	return ShaderNode.signature
    }
    name:string
    minWidth = 150
    uniform = false
    targetCommentID: string | undefined
    dynamicInputs = false
    uniformName: string
    output: Output[]
    inputs: Input[]


    constructor(inputs: Input[], output?: Output[], dynamicInputs?: boolean) {
    	super()
    	this.x = 10
    	this.y = 10
    	this.uniformName = "DYNAMIC_" + this.id.replaceAll("-", "_")
    	this.output = output
    	this.inputs = inputs ? inputs : []


    	const q = Math.max(
    		this.output.length,
    		this.inputs.length
    	) + .5
    	this.minHeight = this.height = HEADER_HEIGHT + q * (HEADER_HEIGHT - 5)
    	this.dynamicInputs = dynamicInputs
    }

    checkAgainstIO<T>(x: number, y: number, asInput?: boolean): T {
    	const R2 = IO_RADIUS ** 2
    	const data = asInput ? this.inputs : this.output


    	for (let i = 0; i < data.length; i++) {
    		if (data[i].disabled)
    			continue
    		const linePosition = DraggableNodeUtils.getIOPosition(i, this, !asInput)
    		const xIO = linePosition.x
    		const yIO = linePosition.y

    		if ((x - xIO) ** 2 + (y - yIO) ** 2 < R2)
    			return <T>data[i]
    	}
    }

    drawToCanvas(ctx: CanvasRenderingContext2D, canvasAPI: Canvas) {
    	CanvasRenderer.drawRoundedRect(ctx, this, 3, canvasAPI.selectionMap.get(this.id) !== undefined, canvasAPI.lastSelection === this, CanvasResources.rectColor)
    	CanvasRenderer.drawNodeHeader(ctx, this, this.type)

    	for (let j = 0; j < this.output.length; j++) {
    		const C = this.output[j]
    		CanvasRenderer.drawIO(ctx, true, this, j, C)
    	}

    	for (let j = 0; j < this.inputs.length; j++) {
    		const C = this.inputs[j]
    		CanvasRenderer.drawIO(ctx, false, this, j, C)
    	}
    	this.drawScale(ctx)
    }

    getFunctionCall?(data: MutableObject, index?: number, outputs?: string[], body?: string[]): string;

    getInputInstance?(index: number, uniforms: MutableObject[], uniformValues: MaterialUniform[], textureOffset?: number): Promise<string>;
}