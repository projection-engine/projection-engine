import GIZMOS from "../../../data/GIZMOS"
import drawIconsToBuffer from "./draw-icons-to-buffer"
import PickingAPI from "../../../../../public/engine/production/apis/utils/PickingAPI";
import SelectionStore from "../../../stores/SelectionStore";
import QueryAPI from "../../../../../public/engine/production/apis/utils/QueryAPI";

const MAX_DELTA = 50, MIDDLE_BUTTON = 1

export default function onViewportClick(event, mouseDelta, settings, setContext) {
    if (gpu.canvas !== event.target || settings.gizmo === GIZMOS.CURSOR || event.button === MIDDLE_BUTTON)
        return
    const deltaX = Math.abs(mouseDelta.x - event.clientX)
    const deltaY = Math.abs(mouseDelta.y - event.clientY)
    if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
        return
    const selected = SelectionStore.engineSelected
    drawIconsToBuffer()
    const entity = QueryAPI.getEntityByPickerID(PickingAPI.readPixelData(event.clientX, event.clientY))

    if (!entity) {
        setContext([])
        return;
    }
    if (event.ctrlKey) {
        if (selected.find(e => e === entity.id))
            setContext(selected.filter(s => s !== entity.id))
        else
            setContext([...selected, entity.id])
    } else
        setContext([entity.id])
}