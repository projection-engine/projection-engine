import {get, writable} from "svelte/store";
import UserInterfaceController from "../../../public/engine/production/controllers/UserInterfaceController";

const uiStore = writable({
    selected: [],
    selectedElement: undefined,
    entities: new Map()
});
export default class UIStore {
    static data = get(uiStore)

    static getStore(onChange) {
        return uiStore.subscribe(newValue => {
            onChange(newValue)
        })
    }
    static updateStore(v = UIStore.data) {
        const value = {...v}
        if (value.selected.length > 0)
            value.selectedEntity = value.entities.get(value.selected[0])
        else
            value.selectedEntity = undefined

        UserInterfaceController.entities = value.entities
        UIStore.data = value
        uiStore.set(value)
    }
}