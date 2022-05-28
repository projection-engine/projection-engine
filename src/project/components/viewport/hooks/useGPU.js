import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import RENDER_TARGET from "./RENDER_TARGET";
import Engine from "../../../extension/Engine";
import SYSTEMS from "../../../engine/templates/SYSTEMS";
import SettingsProvider from "../../../hooks/SettingsProvider";

const callback = (e) => {
    const target = e[0]?.target
const canvas = document.getElementById(RENDER_TARGET)
    if (target) {
        if (target === document.body)
            canvas.style.width = '100%'
        else if(canvas?.parentNode){
            const bBox = canvas.parentNode.getBoundingClientRect()
            canvas.style.width = bBox.width + 'px'
            canvas.style.height = bBox.height + 'px'
        }
    }
}
export default function useGPU(canStart, resolution) {
    const [gpu, setGpu] = useState()
    const [obs, setObs] = useState(new ResizeObserver(callback))
    const [target, setTarget] = useState()
    const settings = useContext(SettingsProvider)
    useEffect(() => {
        const t = document.createElement('canvas')

        t.id = RENDER_TARGET
        const ctx = t.getContext('webgl2', {
            antialias: false,
            preserveDrawingBuffer: true,
            premultipliedAlpha: false
        })
        ctx.getExtension("EXT_color_buffer_float")
        ctx.getExtension('OES_texture_float')
        ctx.getExtension('OES_texture_float_linear')
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        ctx.enable(ctx.CULL_FACE);
        ctx.cullFace(ctx.BACK);
        ctx.enable(ctx.DEPTH_TEST);
        ctx.depthFunc(ctx.LESS);
        ctx.frontFace(ctx.CCW);
        ctx.canvas.width = resolution[0]
        ctx.canvas.height = resolution[1]

        document.body.appendChild(t)
        t.style.background = 'transparent'
        setGpu(ctx)

        setTarget(document.body)
        obs.observe(document.body)
        callback(true)
        return () => obs.disconnect()
    }, [])
    const renderer = useMemo(() => {
        if (gpu && canStart) {
            return new Engine( gpu, {
                w: resolution[0],
                h: resolution[1]
            }, [
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
            ], settings)
        }
        return undefined
    }, [gpu, canStart])
    const bindGPU = useCallback((t) => {
        if (gpu) {
            const resizeObs = new ResizeObserver(callback)
            obs.disconnect()
            resizeObs.observe(t)
            setTarget(t)
            setObs(resizeObs)
            gpu.canvas.style.display = 'block'
            t.appendChild(gpu.canvas)
        }
    }, [gpu])
    return {
        target,
        gpu,
        bindGPU,
        renderer
    }
}