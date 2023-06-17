const MAX_DEPTH = 50
export default class UndoRedo <T>{

	#onDirtyState = false
	index = 0
	history:T[] = [null]
	dirtyState

	save(state:T) {
		if (this.index < this.history.length - 1)
			this.history = this.history.slice(0, this.index)
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

	undo():T {
		const previousIndex = this.index
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
		}
		if (previousIndex !== this.index)
			return this.history[this.index]
	}


	redo():T {
		const previousIndex = this.index
		if (this.index < this.history.length - 1) {
			this.index++
			this.clamp()
		}
		if (previousIndex !== this.index)
			return this.history[this.index]
	}

}

