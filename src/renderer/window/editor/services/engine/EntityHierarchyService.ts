import Engine from "../../../../engine/core/Engine"
import Entity from "../../../../engine/core/instances/Entity"
import HierarchyToRenderElement from "../../views/hierarchy/template/ToRenderElement"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";


export default class EntityHierarchyService {
	static hierarchy: HierarchyToRenderElement[] = []
	static #listening: { [key: string]: Function } = {}

	static updateHierarchy() {
		const data = [], root = Engine.loadedLevel
		if(!root)
			return

		const callback = (node: Entity, depth: number) => {
			if(!node)
				return
			data.push({node, depth})
			node.allComponents.forEach(component => data.push({component, depth: depth + 1}))

			const children = node.children.array
			for (let i = 0; i < children.length; i++)
				callback(children[i], depth + 1)
		}
		callback(root, 0)
		EntityHierarchyService.hierarchy = data
		Object.values(EntityHierarchyService.#listening).forEach(v => v())
	}

	static removeListener(internalID: string) {
		delete EntityHierarchyService.#listening[internalID]
	}

	static registerListener(internalID: string, callback: Function) {
		EntityHierarchyService.#listening[internalID] = callback
		callback()
	}

	static openTree() {
		const node = Engine.entities.get(EntitySelectionStore.getMainEntity())
		if (!node)
			return {}
		const open = {}

		let target = node
		while (target?.parent != null) {
			if (open[target.id])
				break
			open[target.id] = true
			target = target.parent
		}
		Object.values(EntityHierarchyService.#listening).forEach(v => v({...open}))
	}
}
