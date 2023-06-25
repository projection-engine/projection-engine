import VISUAL_SETTINGS from "../editor/static/VISUAL_SETTINGS"
import ChangesTrackerStore from "./ChangesTrackerStore"
import StoreIPCListener from "../shared/lib/StoreIPCListener"
import UIDataStores from "../../shared/UIDataStores"
import AbstractStore from "./AbstractStore"

export default class VisualsStore extends AbstractStore{
	static noPush = false
	static #wasInitialized = false

	constructor() {
		super(VISUAL_SETTINGS)
	}

	updateStore(value) {
		if (VisualsStore.#wasInitialized)
			ChangesTrackerStore.getInstance().updateStore({changed: true})
		VisualsStore.#wasInitialized = true
		super.updateStore(value)
		if (!VisualsStore.noPush)
			StoreIPCListener.getInstance().onUpdate(this.data, UIDataStores.VISUALS)
	}
}

