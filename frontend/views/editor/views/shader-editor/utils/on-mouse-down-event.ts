import Canvas from "../libs/Canvas";
import Draggable from "../templates/Draggable";
import ShaderNode from "../templates/ShaderNode";
import CanvasRenderer from "../libs/CanvasRenderer";
import {Input} from "../templates/Input";
import {Output} from "../templates/Output";

export default function onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI:Canvas, parentBBox, parentElement:HTMLElement, isOnScroll:boolean, event:MouseEvent){
    if (!isOnScroll) {
        const N = canvasAPI.nodes
        const C = canvasAPI.comments
        const X = (event.clientX - BBox.x) / Canvas.scale
        const Y = (event.clientY - BBox.y) / Canvas.scale

        if (!event.ctrlKey) {
            canvasAPI.lastSelection = undefined
            canvasAPI.selectionMap.clear()
        } else
            canvasAPI.selectionMap.forEach(node => {
                nodesOnDrag.push(Draggable.drag(event, node, parentBBox,true))
            })

        let wasBroken = false
        for (let i = N.length - 1; i >= 0; i--) {
            const node = N[i]
            const onBody = node.checkBodyClick(X, Y)
            const onHeader = node.checkHeaderClick(X, Y)
            if (onHeader || onBody) {
                if (onHeader) {
                    nodesOnDrag.push(Draggable.drag(event, node, parentBBox,true))
                    node.isOnDrag = true
                } else if (!event.ctrlKey) {
                    const isOnScale = node.checkAgainstScale(X, Y)
                    if (isOnScale) {
                        nodesOnDrag.push(Draggable.drag(event, node, parentBBox,false))
                        node.isOnDrag = true
                    } else {
                        const output = node.checkAgainstIO<Output>(X, Y)
                        if (output) {
                            IO.node = node
                            IO.output = output
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
                            IO.node = found.sourceNode
                            IO.output = found.sourceRef

                            canvasAPI.links.splice(F, 1)

                            tempLink.x = originalPosition.x
                            tempLink.y = originalPosition.y
                            CanvasRenderer.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
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
                        nodesOnDrag.push(Draggable.drag(event, comment, parentBBox,true))
                        comment.isOnDrag = true
                    } else if (!event.ctrlKey) {
                        const isOnScale = comment.checkAgainstScale(X, Y)
                        if (isOnScale) {
                            nodesOnDrag.push(Draggable.drag(event, comment, parentBBox,false))
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
}