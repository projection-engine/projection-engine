import Engine from "../../Engine"
import EditorEntity from "../../../tools/EditorEntity"
import {UUID} from "crypto";
import {Components,} from "@engine-core/engine.enum";

export default class QueryAPI {
	static getEntityByID(id: UUID|string): EditorEntity | undefined {
		return Engine.entities.get(id as UUID)
	}

	static getEntitiesWithNativeComponent(componentKey: Components): EditorEntity[] {
		const newArr = []
		for (let i = 0; i < Engine.entities.array.length; i++) {
			const entity = Engine.entities.array[i]
			if (entity.Components.get(componentKey) != null)
				newArr.push(entity)
		}
		return newArr
	}

	static getClosestEntityParent(entity: EditorEntity): EditorEntity | undefined {
		// TODO - CLOSEST WITH TRANSFORM COMPONENT
		let currentEntity = entity
		while (currentEntity?.parent) {
			currentEntity = currentEntity.parent
			return currentEntity
		}
	}

	static getClosestParentWithComponent(entity: EditorEntity, component: Components): EditorEntity | undefined {
		let currentEntity = entity
		while (currentEntity?.parent) {
			currentEntity = currentEntity.parent
			if (currentEntity.Components.has(component))
				return currentEntity
		}
	}

	static getEntityDepth(entity: EditorEntity) {
		let depth = 0
		let currentEntity = entity
		while (currentEntity?.parent) {
			depth++
			currentEntity = currentEntity.parent
		}
		return depth
	}

	static isChildOf(entity: EditorEntity, toFind: string): boolean {
		let currentEntity = entity
		while (currentEntity?.parent) {
			if (currentEntity.parent.id === toFind)
				return true
			currentEntity = currentEntity.parent
		}
		return false
	}

	static getHierarchyToObject(root: EditorEntity, obj:MutableObject){
		const children = root.children.array
		for (let i = 0; i < children.length; i++) {
			QueryAPI.getHierarchyToObject(children[i], obj)
			obj[children[i].id] = children[i]
		}
	}
	static getHierarchy(root: EditorEntity, array?: EditorEntity[]): EditorEntity[] {
		const hierarchy =array ?? []
		const children = root.children.array
		for (let i = 0; i < children.length; i++) {
			QueryAPI.getHierarchy(children[i], hierarchy)
			hierarchy.push(children[i])
		}
		return hierarchy
	}
	static loopHierarchy(entity: EditorEntity, callback: Function) {
		const children = entity.children.array
		callback(entity)
		for (let i = 0; i < children.length; i++) {
			const current = children[i]
			QueryAPI.loopHierarchy(current, callback)
		}
	}

	static getEntityByPickerID(id: number): EditorEntity | undefined {
		if (id === 0)
			return
		const entities = Engine.entities.array
		const size = entities.length
		for (let i = 0; i < size; i++) {
			const current = entities[i]
			if (!current.active)
				continue
			if (current.pickIndex === id)
				return current
		}
	}
}
