import GIZMOS from "../../../data/misc/GIZMOS"
import drawIconsToBuffer from "./draw-icons-to-buffer"
import Conversion from "../../../libs/engine/production/libs/Conversion";
import ViewportPicker from "../../../libs/engine/production/libs/ViewportPicker";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import DepthPass from "../../../libs/engine/production/templates/passes/DepthPass";

const  MAX_DELTA = 50

function pickIcon(coords) {
    drawIconsToBuffer()
    const picked = ViewportPicker.depthPick(DepthPass.framebuffer, coords)
    return Math.round((picked[1] + picked[2]) * 255)
}

function pickMesh(x, y) {
    const w = window.gpu.canvas.width, h = window.gpu.canvas.height
    const coords = Conversion.toQuadCoord({x, y}, {w, h})
    const picked = ViewportPicker.depthPick(DepthPass.framebuffer, coords)
    return Math.round((picked[1] + picked[2]) * 255)
}

export default function onViewportClick(event, startedCoords, settings, engine, setContext) {
    if (gpu.canvas !== event.target || settings.gizmo === GIZMOS.CURSOR)
        return
    const deltaX = Math.abs(startedCoords.x - event.clientX)
    const deltaY = Math.abs(startedCoords.y - event.clientY)
    if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
        return

    const target =  gpu.canvas.parentElement.getBoundingClientRect()
    const coords = [event.clientX - target.left, event.clientY - target.top]
    let picked = pickIcon(coords)
    if (!picked)
        picked = pickMesh(event.clientX, event.clientY)
    if (picked > 0) {
        const entities = Array.from(RendererController.entitiesMap.values())
        const entity = entities.find(e => e?.pickIndex === picked)
        if (entity) {
            if (event.ctrlKey) {
                if (engine.selected.find(e => e === entity.id)) {
                    setContext(engine.selected.filter(s => s !== entity.id))
                    return
                }
                if (!engine.selected.find(e => e === entity.id))
                    setContext([...engine.selected, entity.id])
                return
            }
            if (engine.selected.length !== 1 || engine.selected[0] !== entity.id)
                setContext([entity.id])
        }
        return
    }
    if (engine.selected.length > 0)
        setContext([])
}