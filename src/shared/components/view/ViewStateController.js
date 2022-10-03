import SettingsStore from "../../../editor/stores/SettingsStore";

export default class ViewStateController {
    static states = {}

    static getState(viewID, viewIndex) {
        return ViewStateController.states[viewID + "-" + viewIndex + "-" + SettingsStore.data.currentView]
    }

    static updateState(viewID, viewIndex, state) {
        ViewStateController.states[viewID + "-" + viewIndex + "-" + SettingsStore.data.currentView] = state
    }
}