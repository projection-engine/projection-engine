import GizmoSystem from "../../../../../engine-core/tools/gizmo/GizmoSystem"
import Engine from "../../../../../engine-core/core/Engine"
import SettingsStore from "../../../../stores/SettingsStore"
import GPU from "../../../../../engine-core/core/GPU"
import AbstractSingleton from "../../../../../shared/AbstractSingleton"
import ViewportUtil from "../../../util/ViewportUtil"
import SelectionStoreUtil from "../../../util/SelectionStoreUtil"
import GizmoDepthPickingUtil from "../../../../../engine-core/tools/gizmo/util/GizmoDepthPickingUtil"


export default class ViewportInteractionListener extends AbstractSingleton {
	mouseDelta = {x: 0, y: 0}
	static #LEFT_BUTTON = 0

	constructor() {
		super()
		const parentElement = GPU.canvas
		parentElement.addEventListener("mousedown", this.#onMouseDown.bind(this))
		parentElement.addEventListener("mouseup", this.#onMouseUp.bind(this))
	}

	onDestroy() {
		const parentElement = GPU.canvas
		parentElement.removeEventListener("mousedown", this.#onMouseDown.bind(this))
		parentElement.removeEventListener("mouseup", this.#onMouseUp.bind(this))
	}


	#onMouseDown(e) {
		if (!Engine.isReady || e.button !== ViewportInteractionListener.#LEFT_BUTTON)
			return
		this.mouseDelta = {x: e.clientX, y: e.clientY}

		GizmoDepthPickingUtil.onMouseDown(e)
		document.addEventListener("mousemove", GizmoSystem.targetGizmo.onMouseMove)

	}

	#onMouseUp(event) {
		GizmoSystem.targetGizmo.onMouseUp()
		document.removeEventListener("mousemove", GizmoSystem.targetGizmo.onMouseMove)

		if (!Engine.isReady)
			return
		ViewportUtil.onViewportClick(
			event,
			this.mouseDelta,
			SettingsStore.getData(),
			(data) => {
				if (GizmoSystem.wasOnGizmo) {
					GizmoSystem.wasOnGizmo = false
					return
				}
				SelectionStoreUtil.setEntitiesSelected(data)
			})
	}
}