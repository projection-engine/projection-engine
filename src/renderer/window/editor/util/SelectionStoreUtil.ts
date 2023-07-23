import SelectionStore from "../../shared/stores/SelectionStore"
import SelectionTargets from "../../../../shared/enums/SelectionTargets"
import EngineStore from "../../shared/stores/EngineStore"

export default class SelectionStoreUtil{
	static getSelectionTarget():string {
		return SelectionStore.getData().TARGET
	}

	static setEntitiesSelected(data) {
		SelectionStore.updateStore({TARGET: SelectionTargets.ENGINE, array: data})
	}

	static getEntitiesSelected() {
		return SelectionStoreUtil.getSelectionTarget() === SelectionTargets.ENGINE ? SelectionStore.getData().array : []
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
		EngineStore.updateStore({lockedEntity: data})
	}

}
