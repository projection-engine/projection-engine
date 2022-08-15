import {get} from "svelte/store";
import {uiStore} from "./templates/user-interface-store";
import UIRenderer from "../libs/engine/UIRenderer";

export default class UIStoreController {
    static data = get(uiStore)

    static getStore(onChange) {
        return uiStore.subscribe(newValue => {
            onChange(newValue)
        })
    }
    static updateStore(v = UIStoreController.data) {
        const value = {...v}
        if (value.selected.length > 0)
            value.selectedEntity = value.entities.get(value.selected[0])
        else
            value.selectedEntity = undefined

        UIRenderer.entities = value.entities
        UIStoreController.data = value
        uiStore.set(value)
    }
}