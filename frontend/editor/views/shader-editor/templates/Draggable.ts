import HEADER_HEIGHT from "../static/HEADER_HEIGHT"
import SCALE_BUTTON_SIZE from "../static/SCALE_BUTTON_SIZE"
import CanvasResources from "../libs/CanvasResources"

export default class Draggable {
	id = crypto.randomUUID()
	isOnDrag = false
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
		ctx.fillStyle = CanvasResources.borderColor
		ctx.fill()
	}
}