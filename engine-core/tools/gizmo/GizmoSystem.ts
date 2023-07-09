import GPU from "../../core/GPU"
import GizmoUtil from "./util/GizmoUtil"
import GizmoState from "./util/GizmoState"
import GizmoLineSystem from "./GizmoLineSystem"


export default class GizmoSystem {
	static onStart?: Function
	static onStop?: Function

	static translationRef: HTMLElement
	static rotationRef: HTMLElement
	static scaleRef: HTMLElement
	static tooltip
	static updateGizmoToolTip = () => null


	static execute() {
		const context = GPU.context
		context.enable(context.DEPTH_TEST)
		context.clear(context.DEPTH_BUFFER_BIT)
		const m = GizmoState.mainEntity
		if (m != null && m.active) {
			GizmoUtil.createTransformationCache(m)
			const targetGizmosSize = GizmoState.targetGizmos.length
			for (let i = 0; i < targetGizmosSize; i++) {
				GizmoState.targetGizmos[i].drawGizmo()
			}
			if(targetGizmosSize > 0){
				GizmoLineSystem.updateLineMatrix()
				GizmoLineSystem.execute()
			}
		}
		context.enable(context.CULL_FACE)
	}


}
