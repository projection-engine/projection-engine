import AbstractStore from "./AbstractStore"

export default class EntitySelectionStore extends AbstractStore {
    constructor() {
        super({lockedEntity: undefined, array: []} as { lockedEntity: EngineEntity, array: EngineEntity[] })
    }

    static setEntitiesSelected(data: EngineEntity[] | EngineEntity) {
        EntitySelectionStore.updateStore({array: Array.isArray(data) ? data : [data]})
    }

    static getEntitiesSelected(): EngineEntity[] {
        return EntitySelectionStore.getData().array
    }

    static getMainEntity(): EngineEntity | undefined {
        const lockedEntity = EntitySelectionStore.getLockedEntity()
        const firstSelected = EntitySelectionStore.getEntitiesSelected()[0]
        return firstSelected ? firstSelected : lockedEntity
    }

    static getLockedEntity(): EngineEntity | undefined {
        return EntitySelectionStore.getData().lockedEntity
    }

    static setLockedEntity(data: EngineEntity) {
        EntitySelectionStore.updateStore({lockedEntity: data})
    }
}
