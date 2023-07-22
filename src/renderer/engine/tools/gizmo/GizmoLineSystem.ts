import {mat4, quat, vec3} from "gl-matrix"
import GizmoUtil from "./util/GizmoUtil"
import AXIS from "../static/AXIS"
import LineRenderer from "../icons/LineRenderer"
import GizmoState from "./util/GizmoState"

export default class GizmoLineSystem{
	static #lineMatrix = <Float32Array>mat4.create()
	static #NULL_QUAT = <Float32Array>quat.create()
	static #NULL_VEC3 = <Float32Array>vec3.create()
	static #NULL_VEC3_1 = <Float32Array>vec3.create().fill(1)
	static #LINE_SIZE = 1000000


	static updateLineMatrix(){
		mat4.identity(GizmoLineSystem.#lineMatrix)
		GizmoUtil.applyTransformation(GizmoLineSystem.#lineMatrix, GizmoLineSystem.#NULL_QUAT, GizmoLineSystem.#NULL_VEC3, GizmoLineSystem.#NULL_VEC3_1)
	}

	static execute(){
		const axis = GizmoState.clickedAxis
		LineRenderer.setState(0, 0, GizmoLineSystem.#LINE_SIZE)
		switch (axis){
		case AXIS.X:
		case AXIS.XZ:
		case AXIS.XY:
		case AXIS.SCREEN_SPACE:
			LineRenderer.drawX(GizmoLineSystem.#lineMatrix)
			break
		}
		switch (axis){
		case AXIS.Y:
		case AXIS.ZY:
		case AXIS.XY:
		case AXIS.SCREEN_SPACE:
			LineRenderer.drawY(GizmoLineSystem.#lineMatrix)
			break
		}
		switch (axis){
		case AXIS.Z:
		case AXIS.ZY:
		case AXIS.XZ:
		case AXIS.SCREEN_SPACE:
			LineRenderer.drawZ(GizmoLineSystem.#lineMatrix)
			break
		}
		LineRenderer.finish()
	}
}