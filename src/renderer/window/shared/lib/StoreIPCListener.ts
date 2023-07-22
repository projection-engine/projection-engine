import ElectronResources from "./ElectronResources"
import VisualsStore from "../stores/VisualsStore"
import SettingsStore from "../stores/SettingsStore"
import UIDataStores from "../../../../shared/enums/UIDataStores"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"
import AbstractSingleton from "../../../../shared/AbstractSingleton"

export default class StoreIPCListener extends AbstractSingleton {

	constructor() {
		super()
		ElectronResources.ipcRenderer.on(IPCRoutes.STORE_UPDATE, (_, {data, key}) => {
			switch (key) {
			case UIDataStores.SETTINGS:
				SettingsStore.noPush = true
				SettingsStore.updateStore(data)
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

	onUpdate(data: MutableObject, key: string) {
		ElectronResources.ipcRenderer.send(IPCRoutes.STORE_UPDATE, {key, data})
	}


	static getInstance(): StoreIPCListener{
		return super.get<StoreIPCListener>()
	}
}