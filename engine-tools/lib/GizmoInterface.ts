import Mesh from "../../engine-core/instances/Mesh";
import Entity from "../../engine-core/instances/Entity";

export default class GizmoInterface {
    xyz:Mesh
    xGizmo:Entity
    yGizmo:Entity
    zGizmo:Entity

    gridSize:number = 1
    x:number = 0
    y:number = 0

}
