import GizmoSystem from "../../../../../engine-core/tools/runtime/GizmoSystem"
import Engine from "../../../../../engine-core/Engine"
import SelectionStore from "../../../../shared/stores/SelectionStore"
import SettingsStore from "../../../../shared/stores/SettingsStore"
import GPU from "../../../../../engine-core/GPU"
import AbstractSingleton from "../../../../../shared/AbstractSingleton"
import ViewportUtil from "../../../util/ViewportUtil"


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

		GizmoSystem.targetGizmo.onMouseDown(e)
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
			SettingsStore.data,
			(data) => {
				if (GizmoSystem.wasOnGizmo) {
					GizmoSystem.wasOnGizmo = false
					return
				}
				SelectionStore.engineSelected = data
			})
	}
}