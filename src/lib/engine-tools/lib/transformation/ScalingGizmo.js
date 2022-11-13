import {vec3, vec4} from "gl-matrix"
import TRANSFORMATION_TYPE from "../../../../static/TRANSFORMATION_TYPE"
import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import GizmoSystem from "../../runtime/GizmoSystem";
import ScreenSpaceGizmo from "./ScreenSpaceGizmo";
import Inheritance from "../Inheritance";
import Wrapper from "../../Wrapper";
import gizmoScaleEntity from "../../utils/gizmo-scale-entity";

export default class ScalingGizmo extends Inheritance {
    static gridSize = 1
    key = "_scaling"

    static cache = [0, 0, 0]

    constructor() {
        super()
        this.xyz = GizmoSystem.scaleGizmoMesh
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
