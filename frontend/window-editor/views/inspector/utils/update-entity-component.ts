import EditorActionHistory from "../../../lib/utils/EditorActionHistory"
import SelectionStore from "../../../../shared/stores/SelectionStore"
import LightsAPI from "../../../../../engine-core/lib/utils/LightsAPI"
import EngineStore from "../../../../shared/stores/EngineStore"
import CameraAPI from "../../../../../engine-core/lib/utils/CameraAPI"
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS"
import LightComponent from "../../../../../engine-core/instances/components/LightComponent"
import CameraComponent from "../../../../../engine-core/instances/components/CameraComponent"

export default function updateEntityComponent(savedState, setSaved, entity, key, value, save, component) {
	if (component instanceof LightComponent ) {
		entity.needsLightUpdate = true
		LightsAPI.packageLights(true)
	}
	if (!savedState) {
		EditorActionHistory.save(entity)
		setSaved(true)
	}
	if (component instanceof CameraComponent ) {
		entity.__cameraNeedsUpdate = true
	}
	component[key] = value
	if (component.componentKey === COMPONENTS.CAMERA && entity.id === EngineStore.engine.focusedCamera)
		CameraAPI.updateViewTarget(entity)
	if (save) {
		SelectionStore.updateStore()
		EditorActionHistory.save(entity)
	}
}
