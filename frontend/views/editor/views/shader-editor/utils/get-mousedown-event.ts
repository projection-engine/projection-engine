import Canvas from "../libs/Canvas";
import ShaderNode from "../templates/ShaderNode";
import Draggable from "../templates/Draggable";
import CanvasRenderer from "../libs/CanvasRenderer";
import ShaderLink from "../templates/ShaderLink";
import MutableObject from "../../../../../../engine-core/MutableObject";
import onMouseDownEvent from "./on-mouse-down-event";
import {Output} from "../templates/Output";


export default function getMousedownEvent(canvasAPI: Canvas, canvas: HTMLCanvasElement): (this: HTMLCanvasElement, ev: WheelEvent) => void {
    const nodesOnDrag: { onMouseUp: Function, onMouseMove: Function, node: Draggable }[] = []
    const ctx = canvasAPI.ctx
    const IO: { node: ShaderNode | undefined, output: Output | undefined } = {node: undefined, output: undefined}
    const parentElement = canvas.parentElement
    const tempLink = {x: 0, y: 0, x1: 0, y1: 0}
    let isOnScroll = false
    let parentBBox: MutableObject


    const handleMouseMove = (event) => {
        if (!canvasAPI.openFile)
            return
        if (isOnScroll) {
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

    return e => {
        if(e.target !== canvas)
            return
        const BBox = canvas.getBoundingClientRect()
        parentBBox = parentElement.getBoundingClientRect()
        isOnScroll = e.button === 2
        onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, isOnScroll, e)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", e => {
            if (IO.node !== undefined) ShaderLink.handleLink(canvasAPI, e, BBox.x, BBox.y, IO.node, IO.output)
            isOnScroll = false
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
            ctx.canvas.style.cursor = "default"
        }, {once: true})
    }
}