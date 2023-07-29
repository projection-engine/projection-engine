import UndoRedo from "../../../components/UndoRedo"
import FileSystemUtil from "../../../../shared/FileSystemUtil"

export default class NavigationHistory {
    #cache = new UndoRedo<string>()
    setCurrentDirectory?: Function

    constructor(setCurrentDirectory: Function) {
        this.setCurrentDirectory = setCurrentDirectory
    }

    updateCurrentDirectory(
        newCurrentDirectory: { [key: string]: any, id: string },
        currentDirectory: { [key: string]: any, id: string }
    ) {
        this.#cache.save(currentDirectory.id)
        this.setCurrentDirectory(newCurrentDirectory)
        this.#cache.save(newCurrentDirectory.id)
    }


    undo() {
        const hasToApply = this.#cache.undo()
        if (hasToApply)
            this.#apply()
    }

    redo() {
        const hasToApply = this.#cache.redo()
        if (hasToApply)
            this.#apply()
    }

    #apply() {
        this.setCurrentDirectory({
            id: this.#cache.history[this.#cache.index]
        })
    }

    goToParent(currentDirectory: { [key: string]: any, id: string }) {
        const found = currentDirectory.id
        const split = found.split(FileSystemUtil.sep)
        split.pop()
        if (!split.join(FileSystemUtil.sep))
            this.updateCurrentDirectory({id: FileSystemUtil.sep}, currentDirectory)
        else
            this.updateCurrentDirectory({id: split.join(FileSystemUtil.sep)}, currentDirectory)
    }
}
