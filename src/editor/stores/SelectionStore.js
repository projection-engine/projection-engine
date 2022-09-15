import {get, writable} from "svelte/store";
import EngineStore from "./EngineStore";
import {Engine} from "../../../public/engine/production";

const TYPES = {
    ENGINE: "ENGINE",
    CONTENT_BROWSER: "CONTENT_BROWSER",
    SHADER_EDITOR: "SHADER_EDITOR",
    UI: "UI"
}
const selection = writable({TARGET: TYPES.ENGINE, map: new Map(), array: []});
export default class SelectionStore {
    static data = get(selection)
    static TYPES = TYPES

    static get TARGET() {
        return SelectionStore.data.TARGET
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

        if (SelectionStore.TARGET === TYPES.ENGINE) {
            const selected = SelectionStore.engineSelected
            if (!value.lockedEntity)
                value.lockedEntity = selected[0] ? selected[0] : Engine.entities.find(e => !e.parent)?.id

            if (selected.length > 0 || value.lockedEntity)
                value.selectedEntity = Engine.entitiesMap.get(selected[0] ? selected[0] : value.lockedEntity)
            else
                value.selectedEntity = undefined
        } else
            value.selectedEntity = undefined

        SelectionStore.data = value
        selection.set(value)
    }

    static set engineSelected(data) {
        SelectionStore.updateStore({...SelectionStore.data, TARGET: TYPES.ENGINE, array: data})
    }

    static get engineSelected() {
        return SelectionStore.TARGET === TYPES.ENGINE ? SelectionStore.array : []
    }



    static set contentBrowserSelected(data) {
        SelectionStore.updateStore({...SelectionStore.data, TARGET: TYPES.CONTENT_BROWSER, array: data})
    }

    static get contentBrowserSelected() {
        return SelectionStore.TARGET === TYPES.CONTENT_BROWSER ? SelectionStore.array : []
    }

    static set shaderEditorSelected(data) {
        SelectionStore.updateStore({...SelectionStore.data, TARGET: TYPES.SHADER_EDITOR, array: data})
    }

    static get shaderEditorSelected() {
        return SelectionStore.TARGET === TYPES.SHADER_EDITOR ? SelectionStore.array : []
    }


    static get selectedEntity() {
        return SelectionStore.TARGET === TYPES.ENGINE ?  SelectionStore.data.selectedEntity : undefined
    }


    static get lockedEntity() {
        return SelectionStore.data.lockedEntity
    }

    static set lockedEntity(data) {
        SelectionStore.updateStore({...SelectionStore.data, lockedEntity: data, TARGET: TYPES.ENGINE})
    }
}