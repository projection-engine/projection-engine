import AbstractStore from "./AbstractStore"

export default class ViewStateStore extends AbstractStore {
    constructor() {
        super({})
    }

    static getInstance(): ViewStateStore {
        return super.get<ViewStateStore>()
    }

    static updateViewState(viewMetadata: string, newState: MutableObject) {
        const previousData = ViewStateStore.getData()[viewMetadata] ?? {}
        ViewStateStore.getInstance().updateStore({[viewMetadata]: {...previousData, ...newState}})
    }

    static removeState(viewMetadata: string) {
        delete ViewStateStore.getData()[viewMetadata]
    }

    static onViewMount(viewMetadata: string, onIfExists: GenericVoidFunctionWithP<MutableObject>|undefined) {
        const previousData = ViewStateStore.getData()[viewMetadata]
        ViewStateStore.getInstance().updateStore({[viewMetadata]: previousData})
        if (previousData && onIfExists)
            onIfExists(previousData)
    }

    static onViewDestroy(viewMetadata: string, latestState: MutableObject | undefined) {
        const previousData = ViewStateStore.getData()[viewMetadata] ?? {}
        ViewStateStore.getInstance().updateStore({
            [viewMetadata]: {...previousData, ...latestState}
        })
    }
}
