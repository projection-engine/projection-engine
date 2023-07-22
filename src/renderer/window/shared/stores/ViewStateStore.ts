import AbstractStore from "./AbstractStore"

export default class ViewStateStore extends AbstractStore {
    constructor() {
        super({})
    }

    static getInstance(): ViewStateStore {
        return super.get<ViewStateStore>()
    }

    static updateViewStateByProperty(viewMetadata: string, key: string, value: any) {
        ViewStateStore.getInstance().updateStore({[viewMetadata]: {...ViewStateStore.getData()[viewMetadata], [key]: value}})
    }

    static getState(viewMetadata: string):MutableObject|undefined {
        return ViewStateStore.getData()[viewMetadata]
    }

    static updateViewState(viewMetadata: string, newState:MutableObject) {
        ViewStateStore.getInstance().updateStore({[viewMetadata]: {...ViewStateStore.getData()[viewMetadata], ...newState}})
    }

    removeState(viewMetadata: string) {
        delete this.data[viewMetadata]
    }

    static initializeView(viewMetadata: string, initialViewState: MutableObject, updateCallback: Function) {
        const previousState = ViewStateStore.getData()[viewMetadata]

        ViewStateStore.getInstance().updateStore({
            [viewMetadata]: previousState || initialViewState
        })
        ViewStateStore.getInstance().addListener(viewMetadata, data => updateCallback(data[viewMetadata]), [viewMetadata])
    }
}
