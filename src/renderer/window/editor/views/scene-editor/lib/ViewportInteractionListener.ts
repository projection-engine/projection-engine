import Engine from "../../../../../engine/core/Engine"
import SettingsStore from "../../../../shared/stores/SettingsStore"
import GPU from "../../../../../engine/core/GPU"
import AbstractSingleton from "../../../../../../shared/AbstractSingleton"
import ViewportUtil from "../../../util/ViewportUtil"
import GizmoState from "../../../../../engine/tools/gizmo/util/GizmoState"
import GizmoMouseUtil from "../../../../../engine/tools/gizmo/util/GizmoMouseUtil"
import EngineTools from "../../../../../engine/tools/EngineTools";
import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore";


export default class ViewportInteractionListener extends AbstractSingleton {
	mouseDelta = {x: 0, y: 0}
	static #LEFT_BUTTON = 0

	constructor() {
		super()
		GPU.canvas.addEventListener("mousedown", this.#onMouseDown.bind(this))
		document.addEventListener("mouseup", this.#onMouseUp.bind(this))
		document.addEventListener("mousemove", EngineTools.onMouseMove)
	}

	onDestroy() {
		GPU.canvas.removeEventListener("mousedown", this.#onMouseDown.bind(this))
		document.removeEventListener("mouseup", this.#onMouseUp.bind(this))
		document.removeEventListener("mousemove", EngineTools.onMouseMove)
	}


	#onMouseDown(e) {
		if (!Engine.isReady || e.button !== ViewportInteractionListener.#LEFT_BUTTON)
			return
		this.mouseDelta = {x: e.clientX, y: e.clientY}

		GizmoMouseUtil.onMouseDown(e)

	}

	#onMouseUp(event) {
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
				EntitySelectionStore.setEntitiesSelected(data)
			})
	}
}
