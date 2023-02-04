import Canvas from "../libs/Canvas";
import CanvasRenderer from "../libs/CanvasRenderer";
import MutableObject from "../../../../../engine-core/static/MutableObject";
import onMouseDownEvent from "./on-mouse-down-event";
import {Output} from "../static/Output";
import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
import type ShaderNode from "../templates/ShaderNode";
import type Draggable from "../templates/Draggable";
import ShaderLink from "../templates/ShaderLink";

function checkOffset(ev1: MouseEvent, ev2: { x: number, y: number }): boolean {
    return Math.abs(ev1.clientX - ev2.x) < 10 && Math.abs(ev1.clientY - ev2.y) < 10
}

export default function getMousedownEvent(canvasAPI: Canvas): (this: HTMLCanvasElement, ev: WheelEvent) => void {
    const nodesOnDrag: { onMouseUp: Function, onMouseMove: Function, node: Draggable }[] = []
    const IO: { node: ShaderNode | undefined, output: Output | undefined } = {node: undefined, output: undefined}
    const parentElement = canvasAPI.canvas.parentElement
    const tempLink = {x: 0, y: 0, x1: 0, y1: 0}
    let isOnScroll = false
    let parentBBox: MutableObject
    let initialClick = {x: 0, y: 0}


    const handleMouseMove = (event) => {
        if (!canvasAPI.openFile)
            return
        if (isOnScroll) {
            ContextMenuController.blockContext = !checkOffset(event, initialClick)
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
        ContextMenuController.blockContext = false

        if (!isOnScroll)
            onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseDownEvent)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", mouseUpEvent => {
            if (IO.node !== undefined) ShaderLink.handleLink(canvasAPI, mouseUpEvent, BBox.x, BBox.y, IO.node, IO.output)

            if (isOnScroll && checkOffset(mouseUpEvent, initialClick))
                onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseUpEvent)
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