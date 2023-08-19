import IGizmo from "./IGizmo";
import GizmoUtil from "./util/GizmoUtil";
import AXIS from "../static/AXIS";
import Mesh from "@engine-core/instances/Mesh";
import AbstractSingleton from "@engine-core/AbstractSingleton";
import GizmoEntity from "./GizmoEntity";

export default abstract class AbstractXYZGizmo extends AbstractSingleton implements IGizmo {
    declare mesh: Mesh;
    declare xGizmo: GizmoEntity;
    declare yGizmo: GizmoEntity;
    declare zGizmo: GizmoEntity;

    drawToDepth(data) {
        GizmoUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
        GizmoUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
        GizmoUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
    }

    transformGizmo() {
        GizmoUtil.translateMatrix(this.xGizmo)
        GizmoUtil.translateMatrix(this.yGizmo)
        GizmoUtil.translateMatrix(this.zGizmo)
    }

    drawGizmo() {
        GizmoUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.X)
        GizmoUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.Y)
        GizmoUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.Z)
    }

    clearState(): void {
    }


    onMouseMove(event: MouseEvent): void {
    }
}
