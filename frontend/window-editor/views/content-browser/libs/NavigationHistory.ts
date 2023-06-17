import UndoRedo from "../../../lib/utils/UndoRedo"
import FS from "../../../../shared/lib/FS/FS"

export default class NavigationHistory {
	#cache = new UndoRedo<string>()
	setCurrentDirectory?:Function

	constructor(setCurrentDirectory:Function) {
		this.setCurrentDirectory = setCurrentDirectory
	}
	updateCurrentDirectory(newCurrentDirectory:{[key:string]:any, id:string}, currentDirectory:{[key:string]:any, id:string}) {
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
	goToParent(currentDirectory:{[key:string]:any, id:string}) {
		const found = currentDirectory.id
		const split = found.split(FS.sep)
		split.pop()
		if (!split.join(FS.sep))
			this.updateCurrentDirectory({id: FS.sep}, currentDirectory)
		else
			this.updateCurrentDirectory({id: split.join(FS.sep)}, currentDirectory)
	}
}
