import ChangesTrackerStore from "../../stores/ChangesTrackerStore"
import SettingsStore from "../../stores/SettingsStore"
import TabsStore from "../../stores/TabsStore"

export default class TabsStoreUtil {
	static updateByAttributes(direction, group, value) {
		ChangesTrackerStore.getInstance().updateStore({changed: true})
		const settingsData = SettingsStore.getInstance().data
		const clone = {...TabsStore.getInstance().data}
		if (!clone[settingsData.currentView])
			clone[settingsData.currentView] = {}

		if (group !== undefined) {
			if (!clone[settingsData.currentView][direction])
				clone[settingsData.currentView][direction] = {}
			clone[settingsData.currentView][direction][group] = value
		} else
			clone[settingsData.currentView][direction] = value

		TabsStore.getInstance().updateStore(clone)
	}


	static getFocusedTab() {
		return TabsStore.getInstance().data.focused
	}

	static setFocusedTab(data) {
		TabsStore.getInstance().updateStore({focused: data})
	}

	static getCurrentTabByCurrentView(direction, group?: string): number {
		let value
		const settingsData =SettingsStore.getInstance().data
		const tabsData =TabsStore.getInstance().data
		if (group !== undefined)
			value = tabsData[settingsData.currentView]?.[direction]?.[group]
		else
			value = tabsData[settingsData.currentView]?.[direction]
		return value === undefined ? 0 : value
	}
}