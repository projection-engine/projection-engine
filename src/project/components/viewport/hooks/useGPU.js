import {useCallback, useEffect, useState} from "react"
import RENDER_TARGET from "../../../../static/misc/RENDER_TARGET"
import Engine from "../../../engine-extension/Engine"
import SYSTEMS from "../../../engine/templates/SYSTEMS"

const callback = (e) => {
    const target = e[0]?.target
    const canvas = document.getElementById(RENDER_TARGET)
    if (target) {
        if (target === document.body)
            canvas.style.width = "100%"
        else if(canvas?.parentNode){
            const bBox = canvas.parentNode.getBoundingClientRect()
            canvas.style.width = bBox.width + "px"
            canvas.style.height = bBox.height + "px"
        }
    }
}
export default function useGPU(settings, projectID) {
    const [gpu, setGpu] = useState()
    const [renderer, setRenderer] = useState()

    useEffect(() => {
        console.log(projectID && !renderer, projectID, renderer)
        if ( projectID && !renderer) {
            const t = document.createElement("canvas")
            t.id = RENDER_TARGET
            const ctx = t.getContext("webgl2", {
                antialias: false,
                preserveDrawingBuffer: true,
                premultipliedAlpha: false
            })
            ctx.getExtension("EXT_color_buffer_float")
            ctx.getExtension("OES_texture_float")
            ctx.getExtension("OES_texture_float_linear")
            ctx.enable(ctx.BLEND)
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA)
            ctx.enable(ctx.CULL_FACE)
            ctx.cullFace(ctx.BACK)
            ctx.enable(ctx.DEPTH_TEST)
            ctx.depthFunc(ctx.LESS)
            ctx.frontFace(ctx.CCW)

            document.body.appendChild(t)
            t.style.background = "transparent"
            setGpu(ctx)
            setRenderer(
                new Engine(
                    ctx,
                    {w: settings.resolution[0], h:settings.resolution[1]},
                    [
                        SYSTEMS.SCRIPT,
                        SYSTEMS.PERF,
                        SYSTEMS.TRANSFORMATION,
                        SYSTEMS.SHADOWS,
                        SYSTEMS.PICK,
                        SYSTEMS.CAMERA_CUBE,
                        SYSTEMS.CUBE_MAP,
                        SYSTEMS.AO,
                        SYSTEMS.DEPTH_PRE_PASS,
                        SYSTEMS.PROBE
                    ],
                    settings,
                    projectID
                )
            )
        }
    }, [projectID])
    useEffect(() => {
        const obs = new ResizeObserver(callback)
        if(gpu) {
            console.log("HERE")
            gpu.canvas.width = settings.resolution[0]
            gpu.canvas.height = settings.resolution[1]
            obs.observe(gpu.canvas.parentNode)
            callback(true)
        }
        return () => obs.disconnect()
    }, [settings, gpu])

    const bindGPU = useCallback((t) => {
        const currentTarget = t.parentNode
        if (gpu) {
            gpu.canvas.style.display = "block"
            currentTarget.insertBefore(gpu.canvas, t)
        }
    }, [gpu])

    return {
        gpu,
        bindGPU,
        renderer
    }
}