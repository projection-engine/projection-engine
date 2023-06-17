import SettingsStore from "../../shared/stores/SettingsStore"
import VIEWS from "../components/view/static/VIEWS"
import VIEWPORT_TABS from "./VIEWPORT_TABS"
import LocalizationEN from "../../../shared/LocalizationEN";

export default {
	name: LocalizationEN.NEW_TAB + SettingsStore.data.views.length,
	bottom: [[{color: [255, 255, 255], type: VIEWS.FILES}]],
	right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}]],
	viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.EDITOR}],
	left: [],
	top: []
}