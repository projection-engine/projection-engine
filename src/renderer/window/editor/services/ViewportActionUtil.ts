import QueryAPI from "../../../engine/core/lib/utils/QueryAPI"
import {vec3, vec4} from "gl-matrix"
import CameraAPI from "../../../engine/core/lib/utils/CameraAPI"
import CameraTracker from "../../../engine/tools/utils/CameraTracker"
import Engine from "../../../engine/core/Engine"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import EngineStateService from "./engine/EngineStateService"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";


export default class ViewportActionUtil {
	static toCopy = []

	static copy(single?: boolean, target?: string) {
		const selected = EntitySelectionStore.getEntitiesSelected()
		if (target)
			ViewportActionUtil.toCopy = [target]
		else if (single && selected[0])
			ViewportActionUtil.toCopy = [selected[0]]
		else
			ViewportActionUtil.toCopy = [...selected]
	}

	static focus() {
		const entity = QueryAPI.getEntityByID(EntitySelectionStore.getMainEntity())
		if (!entity)
			return

		vec3.copy(CameraAPI.translationBuffer, entity.absoluteTranslation)

		const position = <vec4>[0, 0, 5, 1]
		vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
		vec3.add(CameraAPI.translationBuffer, CameraAPI.translationBuffer, <vec3>position)

		CameraTracker.forceUpdate = true
	}

	static deleteSelected() {
		EngineStateService.removeBlock(EntitySelectionStore.getEntitiesSelected())
	}

	static invertSelection() {
		const newArr = []
		const notValid = {}
		const oldSelected = EntitySelectionStore.getEntitiesSelected()
		for (let i = 0; i < oldSelected.length; i++)
			notValid[oldSelected[i]] = true
		const entities = Engine.entities.array
		for (let i = 0; i < entities.length; i++) {
			if (!notValid[entities[i].id])
				newArr.push(entities[i].id)
		}

		EntitySelectionStore.setEntitiesSelected(newArr)
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
		const selected = EntitySelectionStore.getEntitiesSelected()
		ViewportActionUtil.toCopy = selected
		if (selected.length > 1)
			EngineStateService.linkMultiple(selected)
	}

	static selectAll() {
		EntitySelectionStore.setEntitiesSelected(Array.from(Engine.entities.keys()))
	}

	static fixateActive() {
		const selected = EntitySelectionStore.getEntitiesSelected()
		if (selected[0])
			EntitySelectionStore.setLockedEntity(selected[0])
	}
}
