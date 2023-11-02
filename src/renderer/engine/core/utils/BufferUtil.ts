import GPUState from "@engine-core/states/GPUState";

export default class BufferUtil {
    static createBuffer(type, data, renderingType: number = GPUState.context.STATIC_DRAW) {
        if (!data && data.buffer instanceof ArrayBuffer && data.byteLength !== undefined || data.length === 0)
            return null
        const buffer = GPUState.context.createBuffer()
        GPUState.context.bindBuffer(type, buffer)
        GPUState.context.bufferData(type, data, renderingType)
        return buffer
    }
}
