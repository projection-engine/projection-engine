import ENGINE from "../../window-editor/static/ENGINE";
import {writable} from "svelte/store";

const engine = writable(<MutableObject>ENGINE);

export default class EngineStore {
    static engine: MutableObject = ENGINE

    static getStore(onChange: Function): Function {
        return engine.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value?: MutableObject) {
        let updated = {...(value || EngineStore.engine)}
        EngineStore.engine = updated
        engine.set(updated)
    }

}



