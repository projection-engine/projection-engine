import drawIconsToBuffer from "../../viewport/utils/draw-icons-to-buffer";
import ConversionAPI from "../../../../../../engine-core/lib/math/ConversionAPI";
import GPU from "../../../../../../engine-core/GPU";
import PickingAPI from "../../../../../../engine-core/lib/utils/PickingAPI";
import Engine from "../../../../../../engine-core/Engine";
import SelectionStore from "../../../stores/SelectionStore";
import SelectionWorker from "./SelectionWorker";
import VisibilityRenderer from "../../../../../../engine-core/runtime/VisibilityRenderer";

export default function getUnderSelectionBox(_, startCoords, endCoords) {
    const worker = SelectionWorker.worker
    if (startCoords && endCoords) {
        drawIconsToBuffer()
        const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
        const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)
        try {

            const data = PickingAPI.readBlock(nStart, nEnd)
            worker.postMessage({entities: Engine.entities.array.map(e => ({id: e.id, pick: e.pickIndex})), data}, [data.buffer])
            worker.onmessage = ({data: selected}) => SelectionStore.engineSelected = selected

        } catch (err) {
            console.error(err, startCoords, nStart)
        }

        VisibilityRenderer.needsUpdate = true
    }
}