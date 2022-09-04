import EngineStore from "../windows/project/stores/EngineStore";

import Localization from "./Localization";
import {v4} from "uuid";
import SettingsStore from "../windows/project/stores/SettingsStore";

const MAX_DEPTH = 10
export default class UndoRedoAPI {

    #onDirtyState = false
    index = 0
    history = [null]
    dirtyState

    save(state) {
        if (this.index < this.history.length - 1)
            this.history = this.history.slice(0, this.index);
        if (!this.#onDirtyState) {
            this.#onDirtyState = true
            this.history.push(state)
            if (this.history.length > MAX_DEPTH)
                this.history.shift()
        } else {
            this.#onDirtyState = false
            this.dirtyState = state
        }
        this.index++
    }

    clamp() {
        this.index = Math.max(Math.min(this.history.length - 1, this.index), 1)
    }

    undo() {
        let hasToApply = false
        if (this.dirtyState) {
            this.history.push(this.dirtyState)
            if (this.history.length > MAX_DEPTH)
                this.history.shift()

            this.clamp()
            this.dirtyState = undefined
        }

        if (this.index > 0) {
            this.index--
            this.clamp()
            hasToApply = true
        }
        return hasToApply
    }


    redo() {
        let hasToApply = false
        if (this.index < this.history.length - 1) {
            hasToApply = true
            this.index++
            this.clamp()
        }
        return hasToApply
    }

}

