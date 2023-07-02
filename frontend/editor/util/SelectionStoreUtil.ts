import SelectionStore from "../../stores/SelectionStore"
import SelectionTargets from "../../../shared/SelectionTargets"
import EngineStore from "../../stores/EngineStore"

export default class SelectionStoreUtil{
	static getSelectionTarget():string {
		return SelectionStore.getData().TARGET
	}

	static getSelectionList():string[] {
		return SelectionStore.getData().array
	}
	static setEntitiesSelected(data) {
		SelectionStore.getInstance().updateStore({TARGET: SelectionTargets.ENGINE, array: data})
	}

	static getEntitiesSelected() {
		return SelectionStoreUtil.getSelectionTarget() === SelectionTargets.ENGINE ? SelectionStoreUtil.getSelectionList() : []
	}

	static setContentBrowserSelected(data) {
		SelectionStore.getInstance().updateStore({TARGET: SelectionTargets.CONTENT_BROWSER, array: data})
	}

	static getContentBrowserSelected() {
		return SelectionStoreUtil.getSelectionTarget() === SelectionTargets.CONTENT_BROWSER ? SelectionStoreUtil.getSelectionList() : []
	}

	static getMainEntity() {
		const l = SelectionStoreUtil.getLockedEntity()
		const m = SelectionStoreUtil.getEntitiesSelected()[0]
		return m ? m : l
	}

	static getLockedEntity() {
		return EngineStore.getData().lockedEntity
	}

	static setLockedEntity(data:string) {
		EngineStore.getInstance().updateStore({lockedEntity: data})
	}

}