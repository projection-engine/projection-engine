import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";
import SettingsStore from "../../shared/stores/SettingsStore";
import VIEWS from "../components/view/static/VIEWS";
import VIEWPORT_TABS from "./VIEWPORT_TABS";

export default {
    name: LOCALIZATION_EN.NEW_TAB + SettingsStore.data.views.length,
    bottom: [[{color: [255, 255, 255], type: VIEWS.FILES}]],
    right: [[{color: [255, 255, 255], type: VIEWS.HIERARCHY}]],
    viewport: [{color: [255, 255, 255], type: VIEWPORT_TABS.EDITOR}],
    left: [],
    top: []
}