import SelectionStore from "../../shared/stores/SelectionStore"
import SelectionTargets from "../../../shared/SelectionTargets"

export default class SelectionStoreUtil{
	static getSelectionTarget():string {
		return SelectionStore.data.TARGET
	}

	static getSelectionMap():Map<string,boolean> {
		return SelectionStore.data.map
	}

	static getSelectionList():string[] {
		return SelectionStore.data.array
	}
	static setEntitiesSelected(data) {
		SelectionStore.updateStore({...SelectionStore.data, TARGET: SelectionTargets.ENGINE, array: data})
	}

	static getEntitiesSelected() {
		return SelectionStoreUtil.getSelectionTarget() === SelectionTargets.ENGINE ? SelectionStoreUtil.getSelectionList() : []
	}

	static setContentBrowserSelected(data) {
		SelectionStore.updateStore({...SelectionStore.data, TARGET: SelectionTargets.CONTENT_BROWSER, array: data})
	}

	static getContentBrowserSelected() {
		return SelectionStoreUtil.getSelectionTarget() === SelectionTargets.CONTENT_BROWSER ? SelectionStoreUtil.getSelectionList() : []
	}

	static getMainEntity() {
		const l = SelectionStore.data.lockedEntity
		const m = SelectionStoreUtil.getEntitiesSelected()[0]
		return m ? m : l
	}

	static getLockedEntity() {
		return SelectionStore.data.lockedEntity
	}

	static setLockedEntity(data) {
		SelectionStore.updateStore({...SelectionStore.data, lockedEntity: data, TARGET: SelectionTargets.ENGINE})
	}
}