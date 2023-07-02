import ViewTabItem from "../static/ViewTabItem"
import VIEWPORT_TABS from "../static/VIEWPORT_TABS"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import Engine from "../../../engine-core/Engine"
import GPU from "../../../engine-core/GPU"
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI"
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI"
import VisibilityRenderer from "../../../engine-core/runtime/VisibilityRenderer"
import EngineTools from "../../../engine-core/tools/EngineTools"
import SelectionStoreUtil from "./SelectionStoreUtil"
import EngineStore from "../../stores/EngineStore"
import SettingsStore from "../../stores/SettingsStore"
import LocalizationEN from "../../../shared/LocalizationEN"
import VIEWS from "../components/view/static/VIEWS"

export default class ViewportUtil{
	static updateViewport(currentView:ViewTabItem) {
		if (EngineStore.getData().focusedCamera)
			return
		if (currentView.type === VIEWPORT_TABS.EDITOR) {
			CameraTracker.startTracking()
			Engine.start()
		} else {
			CameraTracker.stopTracking()
			Engine.stop()
		}
	}

	/**
	 *
	 * @param i {number}
	 * @param tabs {object[]}
	 * @param setTabs {function}
	 * @param currentTab {number}
	 * @param cb {function}
	 */
	static removeTab(i, tabs,  setTabs, currentTab, cb) {
		console.trace(tabs)
		const clone  = [...tabs]
		clone.splice(i, 1)
		if (i === currentTab || i < currentTab)
			cb(currentTab === 0 ? 0 : currentTab - 1)

		setTabs(clone)
	}

	static  onViewportClick(event, mouseDelta, settings, setContext) {
		const MAX_DELTA = 50, LEFT_BUTTON = 0
		if (GPU.canvas !== event.target || event.button !== LEFT_BUTTON)
			return
		const deltaX = Math.abs(mouseDelta.x - event.clientX)
		const deltaY = Math.abs(mouseDelta.y - event.clientY)
		if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
			return
		const selected = SelectionStoreUtil.getEntitiesSelected()
		EngineTools.drawIconsToBuffer()

		const clickedEntity = PickingAPI.readEntityID(event.clientX, event.clientY)
		const entity = QueryAPI.getEntityByPickerID(clickedEntity)

		if (!entity) {
			setContext([])
			return
		}

		if (event.ctrlKey) {
			if (selected.find(e => e === entity.id))
				setContext(selected.filter(s => s !== entity.id))
			else
				setContext([...selected, entity.id])
		} else
			setContext([entity.id])

		VisibilityRenderer.needsUpdate = true
	}

	static addNewTab() {
		const views = SettingsStore.getData().views
		views.push({
			name: LocalizationEN.NEW_TAB + views.length,
			bottom: [[{color: [255, 255, 255], type: VIEWS.FILES}]],
			right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}]],
			viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.EDITOR}],
			left: [],
			top: []
		})
		SettingsStore.getInstance().updateStore({views: views})
	}

}