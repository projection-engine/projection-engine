import Canvas from "../libs/Canvas";

export default function getCanvasZoomEvent(canvasAPI: Canvas, canvas: HTMLCanvasElement): (this: HTMLCanvasElement, ev: WheelEvent) => void {
    let localScale = 1
    return e => {
        e.preventDefault()
        // @ts-ignore
        if (e.wheelDelta > 0 && localScale < 3)
            localScale += localScale * .1
        // @ts-ignore
        else if (e.wheelDelta < 0 && localScale >= .5)
            localScale -= localScale * .1

        Canvas.scale = localScale
        canvas.style.backgroundSize = `${20 * localScale}px ${20 * localScale}px`
        canvasAPI.clear()
    }
}