import drawIconsToBuffer from "../../viewport/utils/draw-icons-to-buffer";
import ConversionAPI from "../../../../public/engine/lib/math/ConversionAPI";
import GPU from "../../../../public/engine/GPU";
import PickingAPI from "../../../../public/engine/lib/utils/PickingAPI";
import Engine from "../../../../public/engine/Engine";
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