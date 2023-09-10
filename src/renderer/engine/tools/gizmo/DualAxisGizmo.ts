import AXIS from "../static/AXIS"
import StaticEditorMeshes from "../state/StaticEditorMeshes"
import {vec3} from "gl-matrix"
import GizmoUtil from "../utils/GizmoUtil"
import AbstractSingleton from "@engine-core/AbstractSingleton"
import Mesh from "@engine-core/lib/resources/Mesh"
import GizmoEntity from "./GizmoEntity";
import GizmoRenderingUtil from "../utils/GizmoRenderingUtil";

export default class DualAxisGizmo extends AbstractSingleton implements IGizmo {
	mesh: Mesh
	/**
     * XY gizmo
     */
	xGizmo: GizmoEntity
	/**
     * ZY gizmo
     */
	yGizmo: GizmoEntity
	/**
     * XZ gizmo
     */
	zGizmo: GizmoEntity

	constructor() {
		super()
		this.mesh = StaticEditorMeshes.dualAxisGizmo
		this.xGizmo = DualAxisGizmo.#mapGizmoMesh("XY", 5)
		this.zGizmo = DualAxisGizmo.#mapGizmoMesh("XZ", 6)
		this.yGizmo = DualAxisGizmo.#mapGizmoMesh("ZY", 7)
	}

	clearState(){}

	static #mapGizmoMesh(axis: string, index: number) {
		const rotation = vec3.create()
		const scale = vec3.fromValues(.5, .5, .5)
		switch (axis) {
		case "XY":
			vec3.copy(rotation, [Math.PI / 2, 0, 0])
			break
		case "XZ":
			vec3.copy(rotation, [Math.PI, -Math.PI / 2, Math.PI])
			break
		case "ZY":
			vec3.copy(rotation, [0, Math.PI, -Math.PI / 2])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
	}

	drawGizmo(): void {
		GizmoRenderingUtil.drawGizmo(this.mesh, this.xGizmo.matrix, AXIS.XY)
		GizmoRenderingUtil.drawGizmo(this.mesh, this.zGizmo.matrix, AXIS.XZ)
		GizmoRenderingUtil.drawGizmo(this.mesh, this.yGizmo.matrix, AXIS.ZY)
	}

	drawToDepth(data: MutableObject){
		GizmoRenderingUtil.drawToDepth(data, this.mesh, this.xGizmo.matrix, this.xGizmo.pickID)
		GizmoRenderingUtil.drawToDepth(data, this.mesh, this.zGizmo.matrix, this.zGizmo.pickID)
		GizmoRenderingUtil.drawToDepth(data, this.mesh, this.yGizmo.matrix, this.yGizmo.pickID)
	}

	onMouseMove(){}

	transformGizmo(){
		GizmoUtil.translateMatrix(this.xGizmo)
		GizmoUtil.translateMatrix(this.zGizmo)
		GizmoUtil.translateMatrix(this.yGizmo)
	}
}
