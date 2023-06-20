import ViewTabItem from "../static/ViewTabItem"
import VIEWPORT_TABS from "../static/VIEWPORT_TABS"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import Engine from "../../../engine-core/Engine"
import GPU from "../../../engine-core/GPU"
import SelectionStore from "../../shared/stores/SelectionStore"
import PickingAPI from "../../../engine-core/lib/utils/PickingAPI"
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI"
import VisibilityRenderer from "../../../engine-core/runtime/VisibilityRenderer"
import EngineTools from "../../../engine-core/tools/EngineTools"

export default class ViewportUtil{
	static updateViewport(engine, currentView:ViewTabItem) {
		if (!engine.isReady || engine.focusedCamera)
			return
		if (currentView.type === VIEWPORT_TABS.EDITOR) {

			CameraTracker.startTracking()
			Engine.start()
		} else {
			CameraTracker.stopTracking()
			Engine.stop()
		}
	}

	static removeTab(i, tabs,  setTabs, currentTab, cb) {
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
		const selected = SelectionStore.engineSelected
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



	static addNewTab(tabs, setTabs) {
		const clone  = [...tabs]
		clone.push({type: VIEWPORT_TABS.EDITOR, color: [255,255,255]})
		setTabs(clone)
	}

}