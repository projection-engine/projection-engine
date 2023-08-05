import EditorEntity from "../EditorEntity"
import Mesh from "../../core/instances/Mesh"

interface IGizmo {
    mesh: Mesh,
    xGizmo: EditorEntity,
    yGizmo: EditorEntity,
    zGizmo: EditorEntity,
    drawToDepth: (data:MutableObject) => void,
    onMouseMove: (event: MouseEvent) => void,
    transformGizmo: () => void,
    drawGizmo: () => void,
    clearState: () => void,
}

export default IGizmo
