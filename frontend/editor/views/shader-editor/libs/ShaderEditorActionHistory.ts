import UndoRedo from "../../../components/UndoRedo"
import type Canvas from "./Canvas"
import ShaderNode from "../templates/ShaderNode"
import ShaderComment from "../templates/ShaderComment"
import ShaderEditorTools from "./ShaderEditorTools"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN";


interface Action {
    toRemove: string[]
    toAdd: MutableObject[]
}

export default class ShaderEditorActionHistory {
	#cache = new UndoRedo<Action>()
	canvas: Canvas

	clear() {
		this.#cache.index = 0
		this.#cache.history = [null]
	}

	save(value: (ShaderNode | ShaderComment)[], isRemoval?: boolean) {
		if(value.length === 0)
			return
		const data = value.map(v => {
			if (v instanceof ShaderNode)
				return ShaderEditorTools.serializeNode(v)
			return ShaderEditorTools.serializeComment(v)
		})

		this.#cache.save({
			toRemove: data.map(d => d.id),
			toAdd: !isRemoval ? data : undefined
		})
	}

	undo() {
		const action = this.#cache.undo()
		if (action) {
			ToastNotificationSystem.getInstance().log(LocalizationEN.UNDOING_CHANGES)
			this.#apply(action)
		}
	}

	redo() {
		const action = this.#cache.redo()
		if (action) {
			ToastNotificationSystem.getInstance().log(LocalizationEN.REDOING_CHANGES)
			this.#apply(action)
		}
	}

	#apply(action: Action) {
		const {toAdd, toRemove} = action

		this.canvas.removeNodes(toRemove, true)
		this.canvas.removeComments(toRemove, true)

		if (toAdd)
			for (let i = 0; i < toAdd.length; i++) {
				const current = toAdd[i]
				if (current.DATA_TYPE === "comment") {
					const parsed = new ShaderComment(current.x, current.y)
					parsed.color = current.color
					parsed.name = current.name
					parsed.width = current.width
					parsed.height = current.height
					this.canvas.addComment(parsed, true)
				} else {
					const parsed = ShaderEditorTools.parseNode(current)
					if (!parsed)
						continue
					this.canvas.addNode(parsed, true)
				}
			}
		this.canvas.clear()
	}
}
