import UndoRedo from "../components/UndoRedo"


import serializeStructure from "../../../engine/core/utils/serialize-structure"
import EntityNamingService from "./engine/EntityNamingService"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import ChangesTrackerStore from "../../shared/stores/ChangesTrackerStore"
import EditorEntity from "../../../engine/tools/EditorEntity"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"

interface Action {
    nameCache: Map<string, string>
    toRemove: string[]
    toAdd: string | undefined
}

export default class EditorActionHistory {
	static #cache = new UndoRedo<Action>()

	static clear() {
		EditorActionHistory.#cache.index = 0
		EditorActionHistory.#cache.history = [null]
	}

	static save(value: EditorEntity[] | EditorEntity, isRemoval?: boolean) {
		ChangesTrackerStore.updateStore({changed: true})
		// TODO
		//
		// const data = (Array.isArray(value) ? value.map(v => v?.serializable?.()) : [value.serializable()]).filter(e => e !== undefined)
		// EditorActionHistory.#cache.save({
		// 	nameCache: new Map(EntityNamingService.byName),
		// 	toRemove: data.map(d => d.id),
		// 	toAdd: !isRemoval ? serializeStructure(data) : undefined
		// })
	}

	static undo() {
		const action = EditorActionHistory.#cache.undo()
		if (action) {
			ToastNotificationSystem.getInstance().log(LocalizationEN.UNDOING_CHANGES)
			EditorActionHistory.#apply(action)
		} else
			ChangesTrackerStore.updateStore({changed: true})
	}

	static redo() {
		const action = EditorActionHistory.#cache.redo()
		if (action) {
			ToastNotificationSystem.getInstance().log(LocalizationEN.REDOING_CHANGES)
			EditorActionHistory.#apply(action)
		}
	}

	static #apply(currentAction: Action) {
		// TODO
		// const nameCache = currentAction.nameCache
		// const toRemove = currentAction.toRemove
		// const toAdd: EditorEntity[] = []
		// const parsedToAdd = currentAction.toAdd ? JSON.parse(currentAction.toAdd) : []
		//
		// EntityNamingService.byName = nameCache
		// for (let i = 0; i < parsedToAdd.length; i++) {
		// 	if (!parsedToAdd[i])
		// 		continue
			// toAdd.push(EntityAPI.parseEntityObject(parsedToAdd[i]))
		// }
		// EngineStateService.replaceBlock(toRemove, toAdd)

	}
}

