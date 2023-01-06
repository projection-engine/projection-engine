import UndoRedo from "../../../lib/utils/UndoRedo";
import FS from "../../../../lib/FS/FS";

export default class NavigationHistory extends UndoRedo {
    setCurrentDirectory?:Function

    constructor(setCurrentDirectory:Function) {
        super()
        this.setCurrentDirectory = setCurrentDirectory
    }
    updateCurrentDirectory(v, currentDirectory) {
        this.save(currentDirectory.id)
        this.setCurrentDirectory(v)
        this.save(v.id)
    }


    undo() {
        const hasToApply = super.undo()
        if (hasToApply)
            this.#apply()
    }

    redo() {
        const hasToApply = super.redo()
        if (hasToApply)
            this.#apply()
    }

    #apply() {
        this.setCurrentDirectory({
            id: this.history[this.index]
        })
    }
    goToParent(currentDirectory) {
        const found = currentDirectory.id
        const split = found.split(FS.sep)
        split.pop()
        if (!split.join(FS.sep))
            this.updateCurrentDirectory({id: FS.sep}, currentDirectory)
        else
            this.updateCurrentDirectory({id: split.join(FS.sep)}, currentDirectory)
    }
}
