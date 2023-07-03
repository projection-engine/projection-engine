import ElectronResources from "./ElectronResources"
import VisualsStore from "../../stores/VisualsStore"
import SettingsStore from "../../stores/SettingsStore"
import UIDataStores from "../../../shared/UIDataStores"
import IPCRoutes from "../../../shared/IPCRoutes"
import AbstractSingleton from "../../../shared/AbstractSingleton"

export default class StoreIPCListener extends AbstractSingleton {

	constructor() {
		super()
		ElectronResources.ipcRenderer.on(IPCRoutes.STORE_UPDATE, (_, {data, key}) => {
			switch (key) {
			case UIDataStores.SETTINGS:
				SettingsStore.noPush = true
				SettingsStore.getInstance().updateStore(data)
				SettingsStore.noPush = false
				break
			case UIDataStores.VISUALS:
				VisualsStore.noPush = true
				VisualsStore.getInstance().updateStore(data)
				VisualsStore.noPush = false
				break
			}
		})
	}

	onUpdate(data: MutableObject, key: string) {
		ElectronResources.ipcRenderer.send(IPCRoutes.STORE_UPDATE, {key, data})
	}


	static getInstance(): StoreIPCListener{
		return super.get<StoreIPCListener>()
	}
}