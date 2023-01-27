import Canvas from "../libs/Canvas";
import CanvasRenderer from "../libs/CanvasRenderer";
import {Input} from "../static/Input";
import {Output} from "../static/Output";
import DraggableNodeUtils from "../libs/DraggableNodeUtils";
import CanvasResources from "../libs/CanvasResources";

export default function onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI:Canvas, parentBBox, parentElement:HTMLElement, event:MouseEvent){

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