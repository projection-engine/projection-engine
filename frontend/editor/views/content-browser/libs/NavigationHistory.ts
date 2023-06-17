import UndoRedo from "../../../components/UndoRedo"
import FileSystemService from "../../../../shared/lib/FileSystemService"

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
		const split = found.split(FileSystemService.getInstance().sep)
		split.pop()
		if (!split.join(FileSystemService.getInstance().sep))
			this.updateCurrentDirectory({id: FileSystemService.getInstance().sep}, currentDirectory)
		else
			this.updateCurrentDirectory({id: split.join(FileSystemService.getInstance().sep)}, currentDirectory)
	}
}
