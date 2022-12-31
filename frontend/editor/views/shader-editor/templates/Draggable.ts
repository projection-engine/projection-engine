import HEADER_HEIGHT from "../static/HEADER_HEIGHT";
import Canvas from "../libs/Canvas";
import SCALE_BUTTON_SIZE from "../static/SCALE_BUTTON_SIZE";

export default class Draggable {
    readonly id = crypto.randomUUID()

    width = 200
    height = HEADER_HEIGHT
    minWidth = 10
    minHeight = HEADER_HEIGHT
    x = 10
    y = 10

    checkAgainstScale(x: number, y: number): boolean {
        const XI = this.x + this.width - SCALE_BUTTON_SIZE
        const YI = this.y + this.height - SCALE_BUTTON_SIZE

        const XF = XI + SCALE_BUTTON_SIZE
        const YF = YI + SCALE_BUTTON_SIZE

        return x >= XI && x < XF && y >= YI && y < YF
    }

    checkHeaderClick(x: number, y: number): boolean {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + HEADER_HEIGHT
    }

    checkBodyClick(x: number, y: number): boolean {
        const XI = this.x - 4, XF = this.x + 4 + this.width
        const YI = this.y + HEADER_HEIGHT, YF = YI + this.height - HEADER_HEIGHT
        return x >= XI && x < XF && y >= YI && y < YF
    }

    drawScale(ctx: CanvasRenderingContext2D) {
        const XI = this.x + this.width - SCALE_BUTTON_SIZE
        const YI = this.y + this.height - SCALE_BUTTON_SIZE

        ctx.beginPath()
        ctx.roundRect(XI, YI, SCALE_BUTTON_SIZE, SCALE_BUTTON_SIZE, [0, 0, 3, 0])
        ctx.fillStyle = Canvas.borderColor
        ctx.fill()
    }

    static drag(event: MouseEvent, node: Draggable, asPositionChange: boolean): { onMouseUp: Function, onMouseMove: Function } {
        const bounding = {
            x: !asPositionChange ? 0 : node.x * Canvas.scale - event.clientX,
            y: !asPositionChange ? 0 : node.y * Canvas.scale - event.clientY
        }

        return {
            onMouseUp: () => {
                if (!asPositionChange)
                    return
                if (node.y < 0)
                    node.y = 0
                if (node.x < 0)
                    node.x = 0
                if (node.y > Canvas.height)
                    node.y = Canvas.height - node.height
                if (node.x > Canvas.width)
                    node.x = Canvas.width - node.width
            },
            onMouseMove: ev => {
                let X = Math.round(((ev.clientX + bounding.x) / Canvas.scale) / Canvas.grid) * Canvas.grid
                let Y = Math.round(((ev.clientY + bounding.y) / Canvas.scale) / Canvas.grid) * Canvas.grid
                if (asPositionChange) {
                    node.x = X
                    node.y = Y
                } else {
                    X -= node.x
                    Y -= node.y
                    if (X > node.minWidth && Y > node.minHeight) {
                        node.width = X
                        node.height = Y
                    }
                }

            }
        }
    }
}