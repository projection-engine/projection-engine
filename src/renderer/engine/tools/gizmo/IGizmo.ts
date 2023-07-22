import Entity from "../../core/instances/Entity"
import Mesh from "../../core/instances/Mesh"

interface IGizmo {
    mesh: Mesh,
    xGizmo: Entity,
    yGizmo: Entity,
    zGizmo: Entity,
    drawToDepth: (data:MutableObject) => void,
    onMouseMove: (event: MouseEvent) => void,
    transformGizmo: () => void,
    drawGizmo: () => void,
    clearState: () => void,
}

export default IGizmo