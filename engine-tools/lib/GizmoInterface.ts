import {mat4} from "gl-matrix"
import GizmoSystem from "../runtime/GizmoSystem";
import AXIS from "../static/AXIS";
import DualAxisGizmo from "./transformation/DualAxisGizmo";
import GizmoAPI from "./GizmoAPI";
import PickingAPI from "../../engine-core/lib/utils/PickingAPI";
import UndoRedoAPI from "../../frontend/editor/lib/utils/UndoRedoAPI";
import EngineTools from "../EngineTools";
import drawGizmoToDepth from "../utils/draw-gizmo-to-depth";
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
