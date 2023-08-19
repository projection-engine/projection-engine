import ViewTabItem from "../static/ViewTabItem"
import VIEWPORT_TABS from "../static/VIEWPORT_TABS"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import Engine from "../../../engine/core/Engine"
import GPU from "../../../engine/core/GPU"
import PickingUtil from "@engine-core/utils/PickingUtil"
import EngineTools from "../../../engine/tools/EngineTools"
import EngineStore from "../../shared/stores/EngineStore"
import SettingsStore from "../../shared/stores/SettingsStore"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import VIEWS from "../components/view/static/VIEWS"
import StaticFBOState from "@engine-core/states/StaticFBOState";
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";
import EngineState from "@engine-core/states/EngineState";
import EntityManager from "@engine-core/managers/EntityManager";

export default class ViewportUtil {
    static updateViewport(currentView: ViewTabItem) {
        if (EngineStore.getData().focusedCamera)
            return
        if (currentView.type === VIEWPORT_TABS.EDITOR) {
            EditorCameraSystem.startTracking()
            Engine.start()
        } else {
            EditorCameraSystem.stopTracking()
            Engine.stop()
        }
    }

    static removeTab(i: number, tabs: MutableObject[], setTabs: GenericVoidFunctionWithP<MutableObject[]>, currentTab: number, cb: GenericVoidFunctionWithP<number>) {
        const clone = [...tabs]
        clone.splice(i, 1)
        if (i === currentTab || i < currentTab)
            cb(currentTab === 0 ? 0 : currentTab - 1)

        setTabs(clone)
    }

    static onViewportClick(event, mouseDelta, settings, setContext) {
        const MAX_DELTA = 50, LEFT_BUTTON = 0
        if (GPU.canvas !== event.target || event.button !== LEFT_BUTTON)
            return
        const deltaX = Math.abs(mouseDelta.x - event.clientX)
        const deltaY = Math.abs(mouseDelta.y - event.clientY)
        if (deltaX >= MAX_DELTA || deltaY >= MAX_DELTA)
            return
        const selected = EntitySelectionStore.getEntitiesSelected()
        EngineTools.drawIconsToBuffer()

        const clickedEntity = PickingUtil.readEntityID(event.clientX, event.clientY, 1, StaticFBOState.visibility.FBO)
        const entity = EntityManager.getEntityWithPickIndex(clickedEntity)

        if (!entity) {
            setContext([])
            return
        }

        if (event.ctrlKey) {
            if (selected.find(e => e === entity))
                setContext(selected.filter(s => s !== entity))
            else
                setContext([...selected, entity])
        } else
            setContext([entity])

        EngineState.visibilityNeedsUpdate = true
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
        SettingsStore.updateStore({views: views})
    }

}
