import ConversionAPI from "../lib/math/ConversionAPI"
import GPUState from "../states/GPUState"
import StaticFBOState from "../states/StaticFBOState"

export default class PickingUtil {
    static readBlock(start, end) {
        const w = Math.round(Math.abs(start.x - end.x))
        const h = Math.round(Math.abs(start.y - end.y))
        GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, StaticFBOState.visibility.FBO)
        GPUState.context.readBuffer(GPUState.context.COLOR_ATTACHMENT1)
        const dd = new Uint8Array(w * h * 4)
        GPUState.context.readPixels(
            end.x > start.x ? start.x : end.x,
            end.y > start.y ? start.y : end.y,
            w,
            h,
            GPUState.context.RGBA,
            GPUState.context.UNSIGNED_BYTE,
            dd
        )
        GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)

        return dd
    }

    static getPickerId(i: number) {
        return [
            ((i >> 0) & 0xFF) / 0xFF,
            ((i >> 8) & 0xFF) / 0xFF,
            ((i >> 16) & 0xFF) / 0xFF
        ]
    }

    static readPixels(framebuffer, attachment = 0, coords: { x: number, y: number }) {
        GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, framebuffer)
        GPUState.context.readBuffer(GPUState.context.COLOR_ATTACHMENT0 + attachment)
        const dd = new Uint8Array(4)
        GPUState.context.readPixels(
            coords.x,
            coords.y,
            1,
            1,
            GPUState.context.RGBA,
            GPUState.context.UNSIGNED_BYTE,
            dd
        )
        GPUState.context.bindFramebuffer(GPUState.context.FRAMEBUFFER, null)

        return dd
    }


    static readEntityID(x: number, y: number, attachment:number, framebuffer: WebGLFramebuffer): number {
        const w = GPUState.canvas.width, h = GPUState.canvas.height
        const coords = ConversionAPI.toQuadCoordinates(x, y, w, h)
        const picked = PickingUtil.readPixels(framebuffer, attachment, coords)

        return Math.round(picked[0] + picked[1] + picked[2])
    }


}
