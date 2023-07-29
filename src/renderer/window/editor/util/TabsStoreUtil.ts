import ChangesTrackerStore from "../../shared/stores/ChangesTrackerStore"
import SettingsStore from "../../shared/stores/SettingsStore"
import TabsStore from "../../shared/stores/TabsStore"

export default class TabsStoreUtil {
	static updateByAttributes(direction:"left"|"right"|"top"|"bottom"|"viewport", group:number, value:number) {
		ChangesTrackerStore.updateStore({changed: true})
		const settingsData = SettingsStore.getData()
		const clone = {...TabsStore.getData()}
		if (!clone[settingsData.currentView])
			clone[settingsData.currentView] = {}

		if (group !== undefined) {
			if (!clone[settingsData.currentView][direction])
				clone[settingsData.currentView][direction] = {}
			clone[settingsData.currentView][direction][group] = value
		} else
			clone[settingsData.currentView][direction] = value

		TabsStore.updateStore(clone)
	}


	static getFocusedTab() {
		return TabsStore.getData().focused
	}

	static setFocusedTab(data) {
		TabsStore.updateStore({focused: data})
	}

	static getCurrentTabByCurrentView(direction:"left"|"right"|"top"|"bottom"|"viewport", group?: number): number {
		let value
		const settingsData =SettingsStore.getData()
		const tabsData =TabsStore.getData()
		if (group !== undefined)
			value = tabsData[settingsData.currentView]?.[direction]?.[group]
		else
			value = tabsData[settingsData.currentView]?.[direction]
		return value === undefined ? 0 : value
	}
}
