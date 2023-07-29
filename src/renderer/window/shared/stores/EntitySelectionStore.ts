import AbstractStore from "./AbstractStore"

export default class EntitySelectionStore extends AbstractStore{
	constructor() {
		super({lockedEntity: undefined, array: []})
	}

	static setEntitiesSelected(data:string[]|string)	 {
		EntitySelectionStore.updateStore({array: Array.isArray(data) ? data : [data]})
	}

	static getEntitiesSelected() {
		return EntitySelectionStore.getData().array
	}

	static getMainEntity() {
		const lockedEntity = EntitySelectionStore.getLockedEntity()
		const firstSelected = EntitySelectionStore.getEntitiesSelected()[0]
		return firstSelected ? firstSelected : lockedEntity
	}

	static getLockedEntity() {
		return EntitySelectionStore.getData().lockedEntity
	}

	static setLockedEntity(data:string) {
		EntitySelectionStore.updateStore({lockedEntity: data})
	}
}
