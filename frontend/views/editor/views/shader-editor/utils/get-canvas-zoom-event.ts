import Canvas from "../libs/Canvas";
import CanvasResources from "../libs/CanvasResources";

export default function getCanvasZoomEvent(canvasAPI: Canvas ): (this: HTMLCanvasElement, ev: WheelEvent) => void {
    let localScale = 1
    return e => {
        e.preventDefault()
        // @ts-ignore
        if (e.wheelDelta > 0 && localScale < 3)
            localScale += localScale * .1
        // @ts-ignore
        else if (e.wheelDelta < 0 && localScale >= .5)
            localScale -= localScale * .1

        CanvasResources.scale = localScale
        canvasAPI.canvas.style.backgroundSize = `${20 * localScale}px ${20 * localScale}px`
        canvasAPI.clear()
    }
}