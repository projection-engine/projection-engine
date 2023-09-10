import GizmoUtil from "../utils/GizmoUtil";
import AXIS from "../static/AXIS";
import Mesh from "@engine-core/lib/resources/Mesh";
import AbstractSingleton from "@engine-core/AbstractSingleton";
import GizmoEntity from "./GizmoEntity";
import GizmoRenderingUtil from "../utils/GizmoRenderingUtil";

export default abstract class AbstractXYZGizmo extends AbstractSingleton implements IGizmo {
    declare mesh: Mesh;
    declare xGizmo: GizmoEntity;
    declare yGizmo: GizmoEntity;
    declare zGizmo: GizmoEntity;

    drawToDepth(data) {
        GizmoRenderingUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
        GizmoRenderingUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
        GizmoRenderingUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
    }

    transformGizmo() {
        GizmoUtil.translateMatrix(this.xGizmo)
        GizmoUtil.translateMatrix(this.yGizmo)
        GizmoUtil.translateMatrix(this.zGizmo)
    }

    drawGizmo() {
        GizmoRenderingUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
        GizmoRenderingUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
        GizmoRenderingUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
    }

    clearState(): void {
    }


    onMouseMove(event: MouseEvent): void {
    }
}
