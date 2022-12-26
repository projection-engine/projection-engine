import {get, writable} from "svelte/store";
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI";
import Engine from "../../../engine-core/Engine";
import Entity from "../../../engine-core/instances/Entity";

const TYPES = {
    ENGINE: "ENGINE",
    CONTENT_BROWSER: "CONTENT_BROWSER",
    SHADER_EDITOR: "SHADER_EDITOR"
}
const selection = writable({TARGET: TYPES.ENGINE, map: new Map<string,boolean>(), array: <string[]>[], lockedEntity: undefined});
export default class SelectionStore {
    static data = get(selection)
    static TYPES = TYPES
    static EMPTY_MAP = new Map<string,boolean>()

    static get TARGET():string {
        return SelectionStore.data.TARGET
    }

    static get map():Map<string,boolean> {
        return SelectionStore.data.map
    }

    static get array():string[] {
        return SelectionStore.data.array
    }

    static getStore(onChange):Function {
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
            for (let i = 0; i < value.array.length; i++) {
                const temp = value.array[i]
                if (typeof temp === "object")
                    value.map.set(temp.id || temp.identifier, temp)
                else
                    value.map.set(temp, true)
            }
        }

        if (SelectionStore.TARGET === TYPES.ENGINE) {
            const selected = SelectionStore.engineSelected
            if (!value.lockedEntity)
                value.lockedEntity = selected[0] ? selected[0] : Engine.entities.find(e => !e.parent)?.id
        }

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

    static get shaderEditorSelected():string[] {
        return SelectionStore.TARGET === TYPES.SHADER_EDITOR ? SelectionStore.array : []
    }


    static get selectedEntity():Entity {
        return QueryAPI.getEntityByID(SelectionStore.mainEntity)
    }

    static get mainEntity() {
        const l = SelectionStore.data.lockedEntity
        const m = SelectionStore.engineSelected[0]
        return m ? m : l
    }

    static get lockedEntity() {
        return SelectionStore.data.lockedEntity
    }

    static set lockedEntity(data) {
        SelectionStore.updateStore({...SelectionStore.data, lockedEntity: data, TARGET: TYPES.ENGINE})
    }

}