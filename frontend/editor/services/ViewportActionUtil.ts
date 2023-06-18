import EngineStore from "../../shared/stores/EngineStore"

import SelectionStore from "../../shared/stores/SelectionStore"

import QueryAPI from "../../../engine-core/lib/utils/QueryAPI"
import {vec3, vec4} from "gl-matrix"
import CameraAPI from "../../../engine-core/lib/utils/CameraAPI"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"
import Engine from "../../../engine-core/Engine"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import EngineStateService from "./engine/EngineStateService"


export default class ViewportActionUtil {
	static toCopy = []

	static copy(single?: boolean, target?: string) {
		const selected = SelectionStore.engineSelected
		if (target)
			ViewportActionUtil.toCopy = [target]
		else if (single && selected[0])
			ViewportActionUtil.toCopy = [selected[0]]
		else
			ViewportActionUtil.toCopy = [...selected]
	}

	static focus() {
		const entity = QueryAPI.getEntityByID(SelectionStore.mainEntity)
		if (!entity)
			return

		vec3.copy(CameraAPI.translationBuffer, entity.absoluteTranslation)

		const position = <vec4>[0, 0, 5, 1]
		vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
		vec3.add(CameraAPI.translationBuffer, CameraAPI.translationBuffer, <vec3>position)

		CameraTracker.forceUpdate = true
	}

	static deleteSelected() {
		EngineStateService.removeBlock(SelectionStore.engineSelected)
	}

	static invertSelection() {
		const newArr = []
		const notValid = {}
		const oldSelected = <string[]>SelectionStore.engineSelected
		for (let i = 0; i < oldSelected.length; i++)
			notValid[oldSelected[i]] = true
		const entities = Engine.entities.array
		for (let i = 0; i < entities.length; i++) {
			if (!notValid[entities[i].id])
				newArr.push(entities[i].id)
		}

		SelectionStore.engineSelected = newArr
	}

	static paste(parent?: string) {
		const block = []
		if (!ViewportActionUtil.toCopy)
			return
		const targetParent = parent ? QueryAPI.getEntityByID(parent) : undefined
		for (let i = 0; i < ViewportActionUtil.toCopy.length; i++) {
			const t = ViewportActionUtil.toCopy[i]
			const found = QueryAPI.getEntityByID(t)
			if (found) {
				if (targetParent === found)
					continue
				const clone = found.clone()
				block.push(clone)
				if (!targetParent)
					continue
				clone.addParent(targetParent)
			}
		}
		EngineStateService.appendBlock(block)
		ToastNotificationSystem.getInstance().log(`Pasted ${ViewportActionUtil.toCopy.length} entities.`)

	}

	static group() {
		const selected = SelectionStore.engineSelected
		ViewportActionUtil.toCopy = selected
		if (selected.length > 1)
			EngineStateService.linkMultiple(selected)
	}

	static selectAll() {
		SelectionStore.engineSelected = Array.from(Engine.entities.keys())
	}

	static fixateActive() {
		const selected = SelectionStore.engineSelected
		if (selected[0])
			EngineStore.updateStore({...EngineStore.engine, lockedEntity: selected[0]})
	}
}