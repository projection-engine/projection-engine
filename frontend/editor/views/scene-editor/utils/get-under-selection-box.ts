import drawIconsToBuffer from "../../viewport/utils/draw-icons-to-buffer";
import ConversionAPI from "../../../../../engine-core/lib/math/ConversionAPI";
import GPU from "../../../../../engine-core/lib/GPU";
import PickingAPI from "../../../../../engine-core/lib/utils/PickingAPI";
import Engine from "../../../../../engine-core/Engine";
import SelectionStore from "../../../stores/SelectionStore";
import selectionQueryWorker from "./selection-query-worker";

export default function getUnderSelectionBox(_, startCoords, endCoords) {
    selectionQueryWorker()
    if (startCoords && endCoords) {
        drawIconsToBuffer()
        const nStart = ConversionAPI.toQuadCoord(startCoords, GPU.internalResolution)
        const nEnd = ConversionAPI.toQuadCoord(endCoords, GPU.internalResolution)

        try {
            const data = PickingAPI.readBlock(nStart, nEnd)
            selectionWorker.postMessage({entities: Engine.entities.map(e => ({id: e.id, pick: e.pickID})), data}, [data.buffer])
            selectionWorker.onmessage = ({data: selected}) => SelectionStore.engineSelected = selected
        } catch (err) {
            console.error(err, startCoords, nStart)
        }
    }
}