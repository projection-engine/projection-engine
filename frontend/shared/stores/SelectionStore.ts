import {get, writable} from "svelte/store"
import Engine from "../../../engine-core/Engine"
import AbstractStore from "./AbstractStore"
import SelectionTargets from "../../../shared/SelectionTargets"
import SelectionStoreUtil from "../../editor/util/SelectionStoreUtil"

const selection = writable({TARGET: SelectionTargets.ENGINE, map: new Map<string,boolean>(), array: <string[]>[], lockedEntity: undefined})
export default class SelectionStore extends AbstractStore{
	static data = get(selection) 
 
	static getStore(onChange):Function {
		return selection.subscribe(newValue => onChange(newValue))
	}

	static updateStore(v = SelectionStore.data) {

		let value
		if (Array.isArray(v))
			value = {...SelectionStore.data, array: v}
		else
			value = {...v}
		if (value.array !== SelectionStoreUtil.getSelectionList()) {
			value.map.clear()
			for (let i = 0; i < value.array.length; i++) {
				const temp = value.array[i]
				if (typeof temp === "object")
					value.map.set(temp.id || temp.identifier, temp)
				else
					value.map.set(temp, true)
			}
		}

		if (SelectionStoreUtil.getSelectionTarget() === SelectionTargets.ENGINE) {
			const selected = SelectionStoreUtil.getEntitiesSelected()
			if (!value.lockedEntity)
				value.lockedEntity = selected[0] ? selected[0] : Engine.entities.array.find(e => !e.parent)?.id
		}

		SelectionStore.data = value
		selection.set(value)
		super.updateStore()

	} 
}