import SettingsStore from "../../../../shared/stores/SettingsStore"

export default class ViewStateController {
	static states = {}


	/**
	 * Returns serialized view state (if existent) based on the following attributes
	 * @param viewID
	 * @param viewIndex
	 * @param groupIndex
	 */
	static getState(viewID, viewIndex, groupIndex) {
		return ViewStateController.states[viewID + "-" + viewIndex + "-" + groupIndex + SettingsStore.getData().currentView]
	}

	/**
	 * Serializes view state based on view location
	 * @param viewID
	 * @param viewIndex
	 * @param groupIndex
	 * @param state
	 */
	static updateState(viewID, viewIndex, groupIndex, state) {
		ViewStateController.states[viewID + "-" + viewIndex + "-" + groupIndex + SettingsStore.getData().currentView] = state
	}
}