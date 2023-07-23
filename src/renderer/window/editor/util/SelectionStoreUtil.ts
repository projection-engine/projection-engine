import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"

export default class SelectionStoreUtil{
	static setEntitiesSelected(data) {
		EntitySelectionStore.updateStore({array: data})
	}

	static getEntitiesSelected() {
		return EntitySelectionStore.getData().array
	}

	static getMainEntity() {
		const lockedEntity = SelectionStoreUtil.getLockedEntity()
		const firstSelected = SelectionStoreUtil.getEntitiesSelected()[0]
		return firstSelected ? firstSelected : lockedEntity
	}

	static getLockedEntity() {
		return EntitySelectionStore.getData().lockedEntity
	}

	static setLockedEntity(data:string) {
		EntitySelectionStore.updateStore({lockedEntity: data})
	}

}
