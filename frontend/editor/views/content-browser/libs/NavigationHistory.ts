import UndoRedo from "../../../lib/utils/UndoRedo";
import NodeFS from "../../../../shared/libs/NodeFS";
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
        const split = found.split(NodeFS.sep)
        split.pop()
        if (!split.join(NodeFS.sep))
            this.updateCurrentDirectory({id: NodeFS.sep}, currentDirectory)
        else
            this.updateCurrentDirectory({id: split.join(NodeFS.sep)}, currentDirectory)
    }
}
