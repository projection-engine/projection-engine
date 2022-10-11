import SettingsStore from "../../../../editor/stores/SettingsStore";

export default class ViewStateController {
    static states = {}

    static getState(viewID, viewIndex, groupIndex) {
        return ViewStateController.states[viewID + "-" + viewIndex + "-" + groupIndex + SettingsStore.data.currentView]
    }

    static updateState(viewID, viewIndex, groupIndex, state) {
        ViewStateController.states[viewID + "-" + viewIndex + "-" + groupIndex + SettingsStore.data.currentView] = state
    }
}