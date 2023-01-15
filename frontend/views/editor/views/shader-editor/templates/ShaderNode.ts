import IO_RADIUS from "../static/IO_RADIUS";
import HEADER_HEIGHT from "../static/HEADER_HEIGHT";
import type Canvas from "../libs/Canvas";
import DATA_TYPES from "../static/DATA_TYPES";
import Draggable from "./Draggable";
import CanvasRenderer from "../libs/CanvasRenderer";
import {Input} from "./Input";
import {Output} from "./Output";
import MutableObject from "../../../../../../engine-core/MutableObject";
import MaterialUniform from "../../../../../../engine-core/templates/MaterialUniform";

const types = {
    vec2: 0,
    vec3: 1,
    vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export default class ShaderNode extends Draggable {
    [key: string]: any

    name = "New shader node"
    minWidth = 150
    uniform = false
    targetCommentID: string | undefined
    canBeDeleted = true
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
        const colorWithSelection = this.inputs.filter(e => e.type === DATA_TYPES.COLOR && !e.accept).length * .3

        const q = Math.max(
            this.output.length,
            this.inputs.filter(e => {
                return e.accept !== undefined || e.type == DATA_TYPES.OPTIONS || e.type === DATA_TYPES.COLOR || e.type == DATA_TYPES.CHECKBOX
            }).length + colorWithSelection + .5
        )
        this.minHeight = this.height = HEADER_HEIGHT + q * (HEADER_HEIGHT - 5)
        this.dynamicInputs = dynamicInputs
    }

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

    checkAgainstIO<T>(x: number, y: number, asInput?: boolean): T {
        const R2 = IO_RADIUS ** 2
        const data = asInput ? this.inputs : this.output
        let validIndex = 0

        for (let i = 0; i < data.length; i++) {
            if (asInput && !data[i].accept || data[i].disabled) {
                if(data[i].type !== undefined)
                    validIndex++
                continue
            }
            const linePosition = ShaderNode.getIOPosition(validIndex, this, !asInput)
            const xIO = linePosition.x
            const yIO = linePosition.y
            validIndex++

            if ((x - xIO) ** 2 + (y - yIO) ** 2 < R2)
                return <T>data[i]
        }
    }

    drawToCanvas(ctx: CanvasRenderingContext2D, canvasAPI: Canvas) {
        CanvasRenderer.drawRoundedRect(ctx, this, 3, canvasAPI.selectionMap.get(this.id) !== undefined, canvasAPI.lastSelection === this, canvasAPI.rectColor)
        CanvasRenderer.drawNodeHeader(ctx, this, this.type)

        for (let j = 0; j < this.output.length; j++) {
            const C = this.output[j]
            CanvasRenderer.drawIO(ctx, true, this, j, C)
        }
        let validIndex = 0
        for (let j = 0; j < this.inputs.length; j++) {
            const C = this.inputs[j]
            if (C.accept || C.type === DATA_TYPES.OPTIONS || C.type === DATA_TYPES.CHECKBOX || C.type === DATA_TYPES.COLOR || C.type === DATA_TYPES.TEXTURE) {
                CanvasRenderer.drawIO(ctx, false, this, validIndex, C)
                validIndex++
            }
        }
        this.drawScale(ctx)
    }

    static getIOPosition(index: number, node: ShaderNode, asOutput: boolean): { x: number, y: number, height: number, width: number, rowY: number } {
        const xN = node.x, yN = node.y, w = node.width
        const H = HEADER_HEIGHT - 5
        const Y = yN + H * (index + 2)
        const xIO = !asOutput ? xN : xN + w
        const yIO = Y - IO_RADIUS


        return {x: xIO, y: yIO, height: H, width: w, rowY: Y}
    }

    getFunctionCall?(data: MutableObject, index?: number, outputs?: string[], body?: string[]): string;

    getInputInstance?(index: number, uniforms: MutableObject[], uniformValues: MaterialUniform[], textureOffset?: number): Promise<string>;
}