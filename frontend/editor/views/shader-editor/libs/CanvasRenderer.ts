import ShaderNode from "../templates/ShaderNode";
import DATA_TYPES from "../static/DATA_TYPES";
import IO_RADIUS from "../static/IO_RADIUS";
import Canvas from "./Canvas";
import type ShaderLink from "../templates/ShaderLink";
import HEADER_HEIGHT from "../static/HEADER_HEIGHT";
import type Comment from "../templates/Comment";
import NODE_TYPES from "../static/NODE_TYPES";
import {Input} from "../templates/Input";
import {Output} from "../templates/Output";

export default class CanvasRenderer {
    static drawBezierCurve(ctx: CanvasRenderingContext2D, x1, x2, y1, y2) {
        const diff = Math.abs((x1 - x2) / 2)
        const pivot = Math.min(x1, x2) + diff

        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(pivot, y1, pivot, y2, x2, y2);
        ctx.stroke();
    }

    static drawIO(ctx: CanvasRenderingContext2D, asOutput: boolean, node: ShaderNode, index: number, attribute: Input | Output) {
        ctx.font = asOutput ? "bold 8px Arial" : "8px Arial";

        const isColor = attribute.type === DATA_TYPES.COLOR
        const isTexture = attribute.type === DATA_TYPES.TEXTURE
        const enabled = !attribute.disabled
        const label = attribute.label


        const linePosition = ShaderNode.getIOPosition(index, node, asOutput)

        let X = linePosition.x
        const LABEL_OFFSET = 13
        const H = linePosition.height
        const W = linePosition.width
        const Y = linePosition.rowY
        const YA = linePosition.y
        const labelSize = ctx.measureText(label).width + LABEL_OFFSET
        const T_SIZE = ctx.measureText("T").width

        ctx.beginPath()

        if (isColor && !attribute.accept) {
            const data = node[attribute.key]
            if (!data)
                return;
            ctx.fillStyle = `rgb(${data[0] * 255},${data[1] * 255},${data[2] * 255})`
            ctx.roundRect(X + IO_RADIUS, Y - H / 2, W / 2, H, 3)
            ctx.fill()
            return
        }
        if(!asOutput && !attribute.accept)
            return;
        // if(isTexture){
        //     const data = node[attribute.key]?.label
        //     if(!data)
        //
        //     ctx.fillStyle = "#d7d7d7"
        //     ctx.fillText(label, X - labelSize + LABEL_OFFSET, Y - T_SIZE / 2);
        //     return
        // }

        ctx.fillStyle = ShaderNode.getIOColor(attribute)
        ctx.strokeStyle = Canvas.borderColor
        ctx.lineWidth = .5
        ctx.arc(X, YA, IO_RADIUS, 0, Math.PI * 2)
        ctx.fill()
        if (asOutput) {
            X -= T_SIZE * 2
        } else
            X -= T_SIZE
        if (enabled)
            ctx.stroke()

        ctx.fillStyle = enabled ? "#d7d7d7" : "#afafaf"
        if (asOutput)
            ctx.fillText(label, X - labelSize + LABEL_OFFSET, Y - T_SIZE / 2);
        else
            ctx.fillText(label, X + LABEL_OFFSET, Y - T_SIZE / 2);

        ctx.closePath()
    }

    static drawNodePosition(ctx: CanvasRenderingContext2D, node: Comment | ShaderNode) {
        ctx.font = "bold 10px Arial"

        const TEXT = `X ${node.x} Y ${node.y} W ${node.width} H ${node.height}`
        let Y = node.y - 10
        if (Y < 0)
            Y = node.y + node.height + 10
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.fillText(TEXT, node.x, Y)

    }

    static drawLink(ctx: CanvasRenderingContext2D, link: ShaderLink) {
        const T = link.targetNode, S = link.sourceNode
        const x1 = S.x + S.width, x2 = T.x,
            y1 = S.y + HEADER_HEIGHT + IO_RADIUS * 3 + S.output.indexOf(link.sourceRef) * 20,
            y2 = T.y + HEADER_HEIGHT + IO_RADIUS * 3 + T.inputs.indexOf(link.targetRef) * 20

        ctx.strokeStyle = ShaderNode.getIOColor(link.sourceRef)

        CanvasRenderer.drawBezierCurve(ctx, x1, x2, y1, y2)
    }

    static drawTempLink(event: MouseEvent, parentElement, parentBBox, tempLink, canvasAPI) {
        tempLink.x1 = (event.clientX - parentBBox.x + parentElement.scrollLeft) / Canvas.scale
        tempLink.y1 = (event.clientY - parentBBox.y + parentElement.scrollTop) / Canvas.scale

        canvasAPI.clear()
        canvasAPI.ctx.strokeStyle = "#0095ff"
        CanvasRenderer.drawBezierCurve(canvasAPI.ctx, tempLink.x, tempLink.x1, tempLink.y, tempLink.y1)
    }

    static drawNodeHeader(ctx: CanvasRenderingContext2D, node: ShaderNode | Comment, type?: number) {
        const name = node.name
        ctx.beginPath();

        let fontFill = "#f0f0f0"

        switch (type) {
            case NODE_TYPES.STATIC:
                ctx.fillStyle = "#555"
                break
            case NODE_TYPES.FUNCTION:
                ctx.fillStyle = "purple"
                break
            case NODE_TYPES.OUTPUT:
                ctx.fillStyle = "green"
                break
            case NODE_TYPES.VARIABLE:
                ctx.fillStyle = "red"
                break
            default:
                ctx.fillStyle = `rgb(${(node as Comment).color})`
        }
        ctx.strokeStyle = Canvas.borderColor
        ctx.lineWidth = .5
        ctx.roundRect(node.x, node.y, node.width, 23, [3, 3, 0, 0])
        ctx.stroke()
        ctx.fill()

        ctx.font = "bold 10px Arial";

        ctx.fillStyle = fontFill
        ctx.fillText(name, node.x + IO_RADIUS, node.y + 15);
        if ((node as ShaderNode).uniform) {
            const length = ctx.measureText(name + "T").width
            ctx.font = "6px Arial";
            ctx.fillStyle = "#999"
            ctx.fillText("(DYNAMIC)", node.x + length, node.y + 15);
        }
        ctx.closePath()

    }

    static drawRoundedRect(ctx: CanvasRenderingContext2D, node: ShaderNode | Comment, r: number, isSelected: boolean, isFirstSelected: boolean, color: string) {
        const w = node.width, h = node.height, x = node.x, y = node.y
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        let outlineColor = Canvas.borderColor
        if (isSelected)
            outlineColor = isFirstSelected ? "white" : "darkorange"

        ctx.fillStyle = color
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.strokeStyle = outlineColor

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r)
        ctx.stroke()
        ctx.fill()
    }
}