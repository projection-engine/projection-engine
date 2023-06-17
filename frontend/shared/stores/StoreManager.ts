import ElectronResources from "../lib/ElectronResources"
import VisualsStore from "./VisualsStore"
import SettingsStore from "./SettingsStore"
import UIDataStores from "../../../contants/UIDataStores";
import IPCRoutes from "../../../contants/IPCRoutes";

export default class StoreManager {
	static initialize() {
		ElectronResources.ipcRenderer.on(IPCRoutes.STORE_UPDATE, (_, {data, key}) => {
			switch (key) {
			case UIDataStores.SETTINGS:
				SettingsStore.noPush = true
				SettingsStore.updateStore({...data, views: SettingsStore.data.views})
				SettingsStore.noPush = false
				break
			case UIDataStores.VISUALS:
				VisualsStore.noPush = true
				VisualsStore.updateStore(data)
				VisualsStore.noPush = false
				break
			}
		})
	}

	static onUpdate(data: MutableObject, key: string) {
		ElectronResources.ipcRenderer.send(IPCRoutes.STORE_UPDATE, {key, data})
	}
}