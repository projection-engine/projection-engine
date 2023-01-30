import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import Inheritance from "../Inheritance";
import gizmoScaleEntity from "../../utils/gizmo-scale-entity";
import StaticEditorMeshes from "../StaticEditorMeshes";
import GizmoSystem from "../../runtime/GizmoSystem";

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
        if(GizmoSystem.scaleRef) {
            const mainEntity = GizmoSystem.mainEntity
            GizmoSystem.scaleRef.textContent = `X ${mainEntity._scaling[0].toFixed(2)} | Y ${mainEntity._scaling[1].toFixed(2)} | Z ${mainEntity._scaling[2].toFixed(2)}`
        }
    }
}
