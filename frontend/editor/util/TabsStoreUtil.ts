import ChangesTrackerStore from "../../shared/stores/ChangesTrackerStore"
import SettingsStore from "../../shared/stores/SettingsStore"
import TabsStore from "../../shared/stores/TabsStore"

export default class TabsStoreUtil {
	static updateByAttributes(direction, group, value) {
		ChangesTrackerStore.updateStore(true)
		const clone = {...TabsStore.data}
		if (!clone[SettingsStore.data.currentView])
			clone[SettingsStore.data.currentView] = {}

		if (group !== undefined) {
			if (!clone[SettingsStore.data.currentView][direction])
				clone[SettingsStore.data.currentView][direction] = {}
			clone[SettingsStore.data.currentView][direction][group] = value
		} else
			clone[SettingsStore.data.currentView][direction] = value

		TabsStore.updateStore(clone)
	}


	static getFocusedTab() {
		return TabsStore.data.focused
	}

	static setFocusedTab(data) {
		TabsStore.updateStore({...TabsStore.data, focused: data})
	}

	static getCurrentTabByCurrentView(direction, group?: string): number {
		let value
		if (group !== undefined)
			value = TabsStore.data[SettingsStore.data.currentView]?.[direction]?.[group]
		else
			value = TabsStore.data[SettingsStore.data.currentView]?.[direction]
		return value === undefined ? 0 : value
	}
}