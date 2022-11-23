import GPU from "../../../../public/engine/GPU";
import STATIC_SHADERS from "../../../../public/engine/static/resources/STATIC_SHADERS";
import STATIC_FRAMEBUFFERS from "../../../../public/engine/static/resources/STATIC_FRAMEBUFFERS";
import ConversionAPI from "../../../../public/engine/lib/math/ConversionAPI";

let shader, uniforms
let height

let buffers = []
let FBOs

export default class BufferVisualization {
    static bufferOffset = 0
    static buffers = []

    static initialize() {
        BufferVisualization.buffers = buffers
        shader = GPU.shaders.get(STATIC_SHADERS.PRODUCTION.TO_SCREEN)
        uniforms = shader.uniformMap
        FBOs = Array.from(GPU.frameBuffers.entries())
        FBOs.forEach(([key, framebuffer]) => {
            if (key === STATIC_FRAMEBUFFERS.CURRENT_FRAME || key === STATIC_FRAMEBUFFERS.POST_PROCESSING_WORKER)
                return

            framebuffer.colors.forEach((c, i) => {
                buffers.push({
                    sampler: c,
                    index: i,
                    framebufferKey: key,
                    ...framebuffer.colorsMetadata[i]
                })
            })
            if (framebuffer.depthSampler)
                buffers.push({
                    sampler: framebuffer.depthSampler,
                    index: 0,
                    isDepthSampler: true,
                    framebufferKey: key,
                    width: framebuffer.width,
                    height: framebuffer.height
                })
        })
        BufferVisualization.updateDimensions(250)
    }

    static updateDimensions(heightPerElement) {
        height = heightPerElement
    }

    static execute() {
        // gpu.disable(gpu.DEPTH_TEST)
        gpu.enable(gpu.SCISSOR_TEST)
        shader.bind()
        gpu.scissor(0, 0, gpu.canvas.width, height + 8)
        gpu.viewport(0, 0, gpu.canvas.width, height + 8)
        gpu.clear(gpu.COLOR_BUFFER_BIT)

        gpu.activeTexture(gpu.TEXTURE0)
        gpu.uniform1i(uniforms.image, 0)

        const threshold = ConversionAPI.canvasBBox.width + 350
        const offset = BufferVisualization.bufferOffset
        for (let i = 0; i < buffers.length; i++) {
            const current = buffers[i + offset]
            const translationOffset = (i + 1) * 8 + 350 * i
            if (!current || translationOffset > threshold)
                continue

            gpu.scissor(translationOffset, 8, 350, height)
            gpu.viewport(translationOffset, 8, 350, height)

            gpu.bindTexture(gpu.TEXTURE_2D, current.sampler)
            drawQuad()
        }

        gpu.disable(gpu.SCISSOR_TEST)
        gpu.viewport(0, 0, GPU.internalResolution.w, GPU.internalResolution.h)
        // gpu.enable(gpu.DEPTH_TEST)
    }
}