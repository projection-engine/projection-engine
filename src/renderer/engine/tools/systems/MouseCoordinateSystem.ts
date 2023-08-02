import AbstractSystem from "../../core/AbstractSystem";
import ConversionAPI from "../../core/lib/math/ConversionAPI";
import EngineToolsState from "../EngineToolsState";
import GPU from "../../core/GPU";

export default class MouseCoordinateSystem extends AbstractSystem {
    execute() {
        const coords = ConversionAPI.toQuadCoordinates(EngineToolsState.unconvertedMouseCoordinates[0], EngineToolsState.unconvertedMouseCoordinates[1], GPU.internalResolution.w, GPU.internalResolution.h)
        EngineToolsState.mouseCoordinates[0] = coords.x
        EngineToolsState.mouseCoordinates[1] = coords.y
    }
}
