import StaticEditorMeshes from "../state/StaticEditorMeshes"
import {vec3} from "gl-matrix"
import GizmoUtil from "../utils/GizmoUtil"
import AbstractXYZGizmo from "./AbstractXYZGizmo";
import GizmoManager from "../managers/GizmoManager";
import GizmoState from "../state/GizmoState";

export default class ScalingGizmo extends AbstractXYZGizmo {

	constructor() {
		super()
		this.mesh = StaticEditorMeshes.scaleGizmo
		this.xGizmo = ScalingGizmo.#mapGizmoMesh("x", 2)
		this.yGizmo = ScalingGizmo.#mapGizmoMesh("y", 3)
		this.zGizmo = ScalingGizmo.#mapGizmoMesh("z", 4)
	}

	static #mapGizmoMesh(axis: string, index: number) {
		const rotation = vec3.create()
		const scale = vec3.fromValues(.2, 0.2, 0.2)
		switch (axis) {
		case "x":
			vec3.copy(rotation, [0, Math.PI / 2, 0])
			break
		case "y":
			vec3.copy(rotation, [-Math.PI / 2, Math.PI / 2, 0])
			break
		case "z":
			vec3.copy(rotation, [Math.PI, -Math.PI, Math.PI])
			break
		}
		return GizmoUtil.getGizmoEntity(index, rotation, scale)
	}

	onMouseMove(event) {
		GizmoManager.scale(event.clientX, event.clientY, event.ctrlKey, event.altKey)
		GizmoState.callListeners()
	}
}
