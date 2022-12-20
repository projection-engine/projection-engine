import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import Inheritance from "../Inheritance";
import gizmoScaleEntity from "../../utils/gizmo-scale-entity";
import StaticEditorMeshes from "../StaticEditorMeshes";

export default class ScalingGizmo extends Inheritance {
    static gridSize = 1
    key = "_scaling"

    static cache = [0, 0, 0]

    constructor() {
        super()
        this.xyz = StaticEditorMeshes.scaleGizmo
        this.xGizmo = mapGizmoMesh("x", "SCALE")
        this.yGizmo = mapGizmoMesh("y", "SCALE")
        this.zGizmo = mapGizmoMesh("z", "SCALE")
    }

    onMouseDown(event) {
        super.onMouseDown(event);
        ScalingGizmo.cache = [0, 0, 0]
    }

    onMouseMove(event) {
        super.onMouseMove()
        gizmoScaleEntity(event)
    }
}
