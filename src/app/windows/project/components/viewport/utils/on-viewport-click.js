import GIZMOS from "../../../data/misc/GIZMOS"
import drawIconsToBuffer from "./draw-icons-to-buffer"
import ConversionAPI from "../../../libs/engine/production/libs/ConversionAPI";
import PickingAPI from "../../../libs/engine/production/libs/PickingAPI";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import DepthPass from "../../../libs/engine/production/templates/passes/DepthPass";
import SelectionStore from "../../../stores/SelectionStore";
import BundlerAPI from "../../../libs/engine/production/libs/BundlerAPI";

const MAX_DELTA = 50


function readPixelData(x, y) {
    drawIconsToBuffer()
    const w = window.gpu.canvas.width, h = window.gpu.canvas.height
    const coords = ConversionAPI.toQuadCoord({x, y}, {w, h})
    const picked = PickingAPI.depthPick(DepthPass.framebuffer, coords)
    return Math.round((picked[1] + picked[2]) * 255)
}

export default function onViewportClick(event, mouseDelta, settings, setContext) {
    if (gpu.canvas !== event.target || settings.gizmo === GIZMOS.CURSOR)
        return
    const deltaX = Math.abs(mouseDelta.x - event.clientX)
    const deltaY = Math.abs(mouseDelta.y - event.clientY)
    if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
        return
    const selected = SelectionStore.engineSelected
    const picked = readPixelData(event.clientX, event.clientY)
    if (picked > 0) {
        const entities = Array.from(RendererController.entitiesMap.values())
        const entity = entities.find(e => e?.pickIndex === picked)
        if (entity) {
            if (event.ctrlKey) {
                if (selected.find(e => e === entity.id)) {
                    setContext(selected.filter(s => s !== entity.id))
                    return
                }
                if (!selected.find(e => e === entity.id))
                    setContext([...selected, entity.id])
                return
            }
            if (selected.length !== 1 || selected[0] !== entity.id)
                setContext([entity.id])
        }
        return
    }
    if (selected.length > 0)
        setContext([])
}