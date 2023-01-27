import UndoRedo from "../../../lib/utils/UndoRedo";
import FS from "../../../../../lib/FS/FS";
import type Canvas from "./Canvas";

export default class ShaderEditorActionHistory {
    #cache = new UndoRedo<string>()
    #canvasAPI?:Canvas

    constructor(canvasAPI:Canvas) {
        this.#canvasAPI = canvasAPI
    }

    undo() {
        const action = this.#cache.undo()
        if (action)
            this.#apply(action)
    }

    redo() {
        const action = this.#cache.redo()
        if (action)
            this.#apply(action)
    }

    #apply(action:string) {

    }
}
