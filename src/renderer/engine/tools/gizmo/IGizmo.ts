import Mesh from "@engine-core/lib/resources/Mesh"
import GizmoEntity from "./GizmoEntity";

interface IGizmo {
    mesh: Mesh,
    xGizmo: GizmoEntity,
    yGizmo: GizmoEntity,
    zGizmo: GizmoEntity,
    drawToDepth: (data:MutableObject) => void,
    onMouseMove: (event: MouseEvent) => void,
    transformGizmo: () => void,
    drawGizmo: () => void,
    clearState: () => void,
}

export default IGizmo
