import drawIconsToBuffer from "./draw-icons-to-buffer"
import PickingAPI from "../../../../../public/engine/lib/utils/PickingAPI";
import SelectionStore from "../../../stores/SelectionStore";
import QueryAPI from "../../../../../public/engine/lib/utils/QueryAPI";

const MAX_DELTA = 50, LEFT_BUTTON = 0

export default function onViewportClick(event, mouseDelta, settings, setContext) {
    if (gpu.canvas !== event.target || event.button !== LEFT_BUTTON)
        return
    const deltaX = Math.abs(mouseDelta.x - event.clientX)
    const deltaY = Math.abs(mouseDelta.y - event.clientY)
    if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
        return
    const selected = SelectionStore.engineSelected
    drawIconsToBuffer()

    const clickedEntity = PickingAPI.readEntityID(event.clientX, event.clientY)
    const entity = QueryAPI.getEntityByPickerID(clickedEntity)

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