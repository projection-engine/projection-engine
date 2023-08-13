import EditorEntity from "../../../../engine/tools/EditorEntity"
import HierarchyToRenderElement from "../../views/hierarchy/template/ToRenderElement"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";
import LevelService from "./LevelService";
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import LevelManager from "@engine-core/LevelManager";


export default class EntityHierarchyService {
	static hierarchy: HierarchyToRenderElement[] = []
	static #listening: { [key: string]: Function } = {}

	static updateHierarchy() {
		const data = [], root = EditorEntityManager.getEntity(LevelManager.loadedLevel)
		if(!root)
			return

		const callback = (node: EditorEntity, depth: number) => {
			if(!node)
				return
			data.push({node, depth})
			node.allComponents.forEach(component => data.push({component, depth: depth + 1}))

			const children = node.children
			for (let i = 0; i < children.length; i++)
				callback(EditorEntityManager.getEntity(children[i]), depth + 1)
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
		const node = EditorEntityManager.getEntity(EntitySelectionStore.getMainEntity())
		if (!node)
			return {}
		const open = {}

		let target = node
		while (target?.parent != null) {
			if (open[target.id])
				break
			open[target.id] = true
			target = EditorEntityManager.getEntity(target.parent)
		}
		Object.values(EntityHierarchyService.#listening).forEach(v => v({...open}))
	}
}
