import {get, writable} from "svelte/store";
import ENGINE from "../data/misc/ENGINE";

const TYPES = {
    ENGINE: "ENGINE",
    CONTENT_BROWSER: "CONTENT_BROWSER",
    SHADER_EDITOR: "SHADER_EDITOR"
}
const selection = writable({TARGET: TYPES.ENGINE, selectedEntity: undefined, map: new Map(), array: []});
export default class SelectionStore {
    static data = get(selection)
    static TYPES = TYPES

    static get TARGET() {
        return SelectionStore.data.TARGET
    }

    static get selectedEntity() {
        return SelectionStore.data.selectedEntity
    }

    static get map() {
        return SelectionStore.data.map
    }

    static get array() {
        return SelectionStore.data.array
    }

    static getStore(onChange) {
        return selection.subscribe(newValue => onChange(newValue))
    }

    static updateStore(v = SelectionStore.data) {
        let value
        if (Array.isArray(v))
            value = {...SelectionStore.data, array: v}
        else
            value = {...v}
        if (value.array !== SelectionStore.array) {
            value.map.clear()
            for (let i = 0; i < value.array.length; i++)
                value.map.set(value.array[i], true)
        }
        SelectionStore.data = value
        selection.set(value)
    }

    static updateTarget(target) {
        SelectionStore.updateStore({TARGET: target, selectedEntity: undefined, map: new Map(), array: []})
    }
}