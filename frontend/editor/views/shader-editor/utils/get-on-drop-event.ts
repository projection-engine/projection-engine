import Canvas from "../libs/Canvas";
import getNodeInstance from "./get-node-instance";

export default function getOnDropEvent(canvasAPI: Canvas): (this: HTMLCanvasElement, ev: DragEvent) => void {
    return event => {
        if (!canvasAPI.openFile)
            return
        const dragData = event.dataTransfer.getData("text")
        const node = getNodeInstance(dragData)

        if (!node) return;
        const parent = canvasAPI.ctx.canvas.parentElement
        const BC = parent.getBoundingClientRect()
        node.x = Math.round(((event.clientX - parent.scrollLeft - BC.left) / Canvas.scale) / Canvas.grid) * Canvas.grid
        node.y = Math.round(((event.clientY - parent.scrollTop - BC.top) / Canvas.scale) / Canvas.grid) * Canvas.grid

        canvasAPI.nodes.push(node)
        canvasAPI.clear()
    }
}