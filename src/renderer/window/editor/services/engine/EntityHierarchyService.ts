import EditorEntity from "../../../../engine/tools/EditorEntity"
import HierarchyToRenderElement from "../../views/hierarchy/template/ToRenderElement"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore";
import EditorEntityManager from "../../../../engine/tools/EditorEntityManager";
import EntityManager from "@engine-core/EntityManager";
import DynamicMap from "@engine-core/lib/DynamicMap";


export default class EntityHierarchyService {
	static hierarchy: HierarchyToRenderElement[] = []
	static #listening = new DynamicMap<string, VoidFunction>()

	static updateHierarchy() {
		const data = []
		const callback = (node: EditorEntity, depth: number) => {
			if(!node)
				return
			data.push({node, depth})
			node.allComponents.forEach(component => data.push({component, depth: depth + 1}))

			const children = node.children
			for (let i = 0; i < children.length; i++)
				callback(EditorEntityManager.getEntity(children[i]), depth + 1)
		}
		const entities = EntityManager.getEntityKeys()
		entities.forEach(e => {
			if(EntityManager.hasParent(e))
				return
			callback(EditorEntityManager.getEntity(e), 0)
		})
		EntityHierarchyService.hierarchy = data
		EntityHierarchyService.#listening.array.forEach(v => v())
	}

	static removeListener(internalID: string) {
		EntityHierarchyService.#listening.delete(internalID)
	}

	static registerListener(internalID: string, callback: VoidFunction) {
		EntityHierarchyService.#listening.set(internalID, callback)
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
