import Mesh from "../../core/instances/Mesh"
import Entity from "../../core/instances/Entity"

export default class GizmoInterface {
	xyz:Mesh
	xGizmo:Entity
	yGizmo:Entity
	zGizmo:Entity

	gridSize = 1
	x = 0
	y = 0
}
