import {useCallback, useEffect, useState} from "react"
import Engine from "../../../engine-extension/Engine"
import SYSTEMS from "../../../engine/templates/SYSTEMS"


export default function useGPU(settings, projectID) {
    const [gpu, setGpu] = useState()
    const [renderer, setRenderer] = useState()

    useEffect(() => {
        if(gpu){
            gpu.canvas.width = settings.resolution[0]
            gpu.canvas.height = settings.resolution[1]
        }
    }, [settings.resolution])

    const bindGPU = useCallback((t) => {
        if ( !renderer ) {
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
            t.width = settings.resolution[0]
            t.height = settings.resolution[1]
            t.style.width = "100%"
            t.style.height = "100%"
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
                        SYSTEMS.PROBE,
                        SYSTEMS.SSGI
                    ],
                    settings,
                    projectID
                )
            )
        }
    }, [renderer])

    return {
        gpu,
        bindGPU,
        renderer
    }
}