import Canvas from "../libs/Canvas";
import type {Input, Output} from "../templates/ShaderNode";
import ShaderNode from "../templates/ShaderNode";
import IO_RADIUS from "../static/IO_RADIUS";
import Draggable from "../templates/Draggable";
import CanvasRenderer from "../libs/CanvasRenderer";
import ShaderLink from "../templates/ShaderLink";
import MutableObject from "../../../../../engine-core/MutableObject";


export default function getMousedownEvent(canvasAPI: Canvas, canvas: HTMLCanvasElement): (this: HTMLCanvasElement, ev: WheelEvent) => void {
    const nodesOnDrag: { onMouseUp: Function, onMouseMove: Function, node:Draggable}[] = []
    const ctx = canvasAPI.ctx

    const parentElement = canvas.parentElement
    let isOnScroll = false
    let IO: [ShaderNode, Output]
    let parentBBox: MutableObject
    const tempLink = {x: 0, y: 0, x1: 0, y1: 0}

    function drawTempLink(event: MouseEvent) {
        tempLink.x1 = (event.clientX + parentBBox.x + parentElement.scrollLeft) / Canvas.scale
        tempLink.y1 = (event.clientY + parentBBox.y + parentElement.scrollTop - IO_RADIUS ** 2) / Canvas.scale

        canvasAPI.clear()
        ctx.strokeStyle = "#0095ff"
        CanvasRenderer.drawBezierCurve(ctx, tempLink.x, tempLink.x1, tempLink.y, tempLink.y1)
    }

    const handleMouseMove = (event) => {
        if (isOnScroll) {
            parentElement.scrollTop -= event.movementY
            parentElement.scrollLeft -= event.movementX
        } else {
            const S = nodesOnDrag.length
            if (IO !== undefined)
                drawTempLink(event)
            else if (S > 0) {
                for (let i = 0; i < S; i++)
                    nodesOnDrag[i].onMouseMove(event)
                canvasAPI.clear()
            }
        }
    }

    return e => {
        const BBox = canvas.getBoundingClientRect()
        parentBBox = parentElement.getBoundingClientRect()
        isOnScroll = e.button === 2

        if (!isOnScroll) {
            const N = canvasAPI.nodes
            const C = canvasAPI.comments
            const X = (e.clientX - BBox.x) / Canvas.scale
            const Y = (e.clientY - BBox.y) / Canvas.scale

            if (!e.ctrlKey) {
                canvasAPI.lastSelection = undefined
                canvasAPI.selectionMap.clear()
            } else
                canvasAPI.selectionMap.forEach(node => {
                    nodesOnDrag.push(Draggable.drag(e, node, true))
                })

            let wasBroken = false
            for (let i = N.length - 1; i >= 0; i--) {
                const node = N[i]
                const onBody = node.checkBodyClick(X, Y)
                const onHeader = node.checkHeaderClick(X, Y)
                if (onHeader || onBody) {
                    if (onHeader) {
                        nodesOnDrag.push(Draggable.drag(e, node, true))
                        node.isOnDrag = true
                    }
                    else if (!e.ctrlKey) {
                        const isOnScale = node.checkAgainstScale(X, Y)
                        if (isOnScale) {
                            nodesOnDrag.push(Draggable.drag(e, node, false))
                            node.isOnDrag = true
                        }
                        else {
                            const output = node.checkAgainstIO<Output>(X, Y)
                            if (output) {
                                IO = [node, output]
                                const position = ShaderNode.getIOPosition(node.output.indexOf(output), node, true)
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
                                const originalPosition = ShaderNode.getIOPosition(found.sourceNode.output.indexOf(found.sourceRef), found.sourceNode, true)
                                IO = [found.sourceNode, found.sourceRef]

                                canvasAPI.links.splice(F, 1)

                                tempLink.x = originalPosition.x
                                tempLink.y = originalPosition.y
                                drawTempLink(e)
                            }
                        }
                    }
                    canvasAPI.selectionMap.set(node.id, node)
                    canvasAPI.lastSelection = node
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
                            nodesOnDrag.push(Draggable.drag(e, comment, true))
                            comment.isOnDrag = true
                        }
                        else if (!e.ctrlKey) {
                            const isOnScale = comment.checkAgainstScale(X, Y)
                            if (isOnScale) {
                                nodesOnDrag.push(Draggable.drag(e, comment, false))
                                comment.isOnDrag = true
                            }
                        }
                        canvasAPI.selectionMap.set(comment.id, comment)
                        canvasAPI.lastSelection = comment
                        break
                    }
                }

            if (nodesOnDrag.length > 0 || IO)
                ctx.canvas.style.cursor = "grabbing"
            canvasAPI.clear()
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", e => {
            if (IO) ShaderLink.handleLink(canvasAPI, e, BBox.x, BBox.y, IO[0], IO[1])
            isOnScroll = false
            IO = undefined
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