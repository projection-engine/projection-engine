import Engine from "../../../../../engine-core/core/Engine"
import SettingsStore from "../../../../stores/SettingsStore"
import GPU from "../../../../../engine-core/core/GPU"
import AbstractSingleton from "../../../../../shared/AbstractSingleton"
import ViewportUtil from "../../../util/ViewportUtil"
import SelectionStoreUtil from "../../../util/SelectionStoreUtil"
import GizmoState from "../../../../../engine-core/tools/gizmo/util/GizmoState"
import GizmoMouseUtil from "../../../../../engine-core/tools/gizmo/util/GizmoMouseUtil"


export default class ViewportInteractionListener extends AbstractSingleton {
	mouseDelta = {x: 0, y: 0}
	static #LEFT_BUTTON = 0

	constructor() {
		super()
		GPU.canvas.addEventListener("mousedown", this.#onMouseDown.bind(this))
		document.addEventListener("mouseup", this.#onMouseUp.bind(this))
	}

	onDestroy() {
		GPU.canvas.removeEventListener("mousedown", this.#onMouseDown.bind(this))
		document.removeEventListener("mouseup", this.#onMouseUp.bind(this))
	}


	#onMouseDown(e) {
		if (!Engine.isReady || e.button !== ViewportInteractionListener.#LEFT_BUTTON)
			return
		this.mouseDelta = {x: e.clientX, y: e.clientY}

		GizmoMouseUtil.onMouseDown(e)
		document.addEventListener("mousemove", GizmoMouseUtil.onMouseMove)

	}

	#onMouseUp(event) {
		document.removeEventListener("mousemove", GizmoMouseUtil.onMouseMove)
		GizmoMouseUtil.onMouseUp()

		if (!Engine.isReady)
			return
		ViewportUtil.onViewportClick(
			event,
			this.mouseDelta,
			SettingsStore.getData(),
			(data) => {
				if (GizmoState.wasOnGizmo) {
					GizmoState.wasOnGizmo = false
					return
				}
				SelectionStoreUtil.setEntitiesSelected(data)
			})
	}
}