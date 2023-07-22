import VISUAL_SETTINGS from "../../editor/static/VISUAL_SETTINGS"
import ChangesTrackerStore from "./ChangesTrackerStore"
import StoreIPCListener from "../lib/StoreIPCListener"
import UIDataStores from "../../../../shared/enums/UIDataStores"
import AbstractStore from "./AbstractStore"

export default class VisualsStore extends AbstractStore{
	static noPush = false
	static #wasInitialized = false

	constructor() {
		super(VISUAL_SETTINGS)
	}

	updateStore(value) {
		if (VisualsStore.#wasInitialized)
			ChangesTrackerStore.updateStore({changed: true})
		VisualsStore.#wasInitialized = true
		super.updateStore(value)
		if (!VisualsStore.noPush)
			StoreIPCListener.getInstance().onUpdate(this.data, UIDataStores.VISUALS)
	}
}

