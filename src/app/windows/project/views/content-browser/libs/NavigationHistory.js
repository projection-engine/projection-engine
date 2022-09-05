import UndoRedoAPI from "../../../../../libs/UndoRedoAPI";
import FilesAPI from "../../../../../libs/files/FilesAPI";

export default class NavigationHistory extends UndoRedoAPI {
    constructor(setCurrentDirectory) {
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
        const split = found.split(FilesAPI.sep)
        split.pop()
        if (!split.join(FilesAPI.sep))
            this.updateCurrentDirectory({id: FilesAPI.sep}, currentDirectory)
        else
            this.updateCurrentDirectory({id: split.join(FilesAPI.sep)}, currentDirectory)
    }
}
