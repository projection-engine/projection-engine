import HierarchyToRenderElement from "../views/hierarchy/template/ToRenderElement"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import Entity from "../../../engine/core/instances/Entity"
import Engine from "../../../engine/core/Engine"
import EngineStateService from "../services/engine/EngineStateService"
import EditorUtil from "./EditorUtil"
import HotKeysController from "../../shared/lib/HotKeysController";
import getViewportHotkeys from "../templates/get-viewport-hotkeys";
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";

export default class HierarchyUtil {
	static buildTree(openTree: { [key: string]: boolean }, search: string, filteredComponent: string): HierarchyToRenderElement[] {

		const hierarchy = EntityHierarchyService.hierarchy
		const data: HierarchyToRenderElement[] = []
		let blockStart = -1
		let minDepth = -1
		let blockEnd = -1
		const hasSearch = search || filteredComponent
		for (let i = 0; i < hierarchy.length; i++) {
			const current = hierarchy[i]
			let node = current.node

			if (hasSearch) {
				data.push(current)
				if (!node)
					continue
				if (blockStart === -1)
					blockStart = i
				if (minDepth === -1)
					minDepth = current.depth

				if (hierarchy[i + 1]?.depth > current.depth && hierarchy[i + 1]?.node)
					continue
				blockEnd = i
				if (blockEnd !== blockStart)
					HierarchyUtil.#searchTree(blockStart, blockEnd, data, hierarchy, search, filteredComponent)
				if (minDepth > hierarchy[i + 1]?.depth) {
					blockStart = -1
					minDepth = -1
				}
			} else {
				if (!node) {
					node = current.component.entity
					if (openTree[node.id] && openTree[node.parent.id])
						data.push(current)
					continue
				}
				if (!node.parent || openTree[node.parent?.id])
					data.push(current)
			}
		}
		return hasSearch ? data.filter(e => e !== undefined && e.node !== undefined) : data
	}


	static getEngineIcon(nodeRef): { icon: string, label: string }[] {
		const icons = []
		if (nodeRef) {

			if (nodeRef.atmosphereComponent)
				icons.push({
					icon: "wb_twilight",
					label: LocalizationEN.ATMOSPHERE
				})
			if (nodeRef.lightProbeComponent)
				icons.push({
					icon: "lens_blur",
					label: LocalizationEN.LIGHT_PROBE
				})
			if (nodeRef.meshComponent)

				icons.push({
					icon: "category",
					label: LocalizationEN.MESH
				})
			if (nodeRef.cameraComponent)

				icons.push({
					icon: "videocam",
					label: LocalizationEN.CAMERA
				})
			if (nodeRef.spriteComponent)
				icons.push({
					icon: "image",
					label: LocalizationEN.SPRITE
				})
			if (nodeRef.uiComponent)
				icons.push({
					icon: "widgets",
					label: LocalizationEN.UI_LAYOUT
				})

			if (nodeRef.lightComponent)
				icons.push({
					icon: "light_mode",
					label: LocalizationEN.LIGHT
				})
		}
		return icons
	}

	static handleDrop(event, entityDragged: Entity | Entity[], dropTargetEntity: Entity | undefined) {

		const toSave = Array.isArray(entityDragged) ? entityDragged : [entityDragged]

		const toAdd = [], newSelection = []

		for (let i = 0; i < toSave.length; i++) {
			const currentEntity = <Entity>toSave[i]
			if (currentEntity === Engine.loadedLevel)
				continue
			if (event.ctrlKey || dropTargetEntity?.isCollection) {
				if (!dropTargetEntity) {
					currentEntity.removeParent()
					currentEntity.addParent(Engine.loadedLevel)
				} else
					currentEntity.addParent(dropTargetEntity)
			} else if (event.shiftKey) {
				const clone = currentEntity.clone()
				clone.removeParent()
				clone.parentID = dropTargetEntity?.id
				toAdd.push(clone)
				newSelection.push(clone.id)
			}
		}

		if (toAdd.length > 0)
			EngineStateService.appendBlock(toAdd)
		else {
			EntitySelectionStore.setEntitiesSelected(newSelection)
			EntityHierarchyService.updateHierarchy()
		}
	}

	static mapComponents(entity: Entity) {
		return entity.allComponents.map(e => ({
			icon: EditorUtil.getComponentIcon(e.componentKey),
			label: EditorUtil.getComponentLabel(e.componentKey)
		}))
	}

	static #searchTree(start: number, end: number, arr: HierarchyToRenderElement[], toSearch: HierarchyToRenderElement[], search: string, filteredComponent: string) {
		for (let i = end; i > start; i--) {
			const data = toSearch[i]
			if (!data?.node)
				break
			const searchMatches = HierarchyUtil.testSearch(filteredComponent, search, data.node)
			if (searchMatches)
				break
			else
				arr[i] = undefined
		}
	}

	static testSearch(filteredComponent, search, node) {
		return (!search || search && node.name.includes(search)) && (!filteredComponent || filteredComponent && node.components.has(filteredComponent))
	}

	static updateSelection(entityID: string, ctrlKey?: boolean) {
		if (ctrlKey) {
			const entitiesSelected = EntitySelectionStore.getEntitiesSelected()
			if (!entitiesSelected.includes(entityID))
				EntitySelectionStore.setEntitiesSelected([...entitiesSelected, entityID])
			else
				EntitySelectionStore.setEntitiesSelected(entitiesSelected.filter(e => e !== entityID))
		} else
			EntitySelectionStore.setEntitiesSelected(entityID)
	}

	static initializeView(draggable, ref:HTMLElement){
		HotKeysController.bindAction(
			ref,
			Object.values(getViewportHotkeys()),
			"public",
			LocalizationEN.VIEWPORT
		)
		draggable.onMount({
			targetElement: ref,
			onDrop: (entityDragged, event) => {
				const node = event.composedPath().find(n => n?.getAttribute?.("data-sveltenode") != null)?.getAttribute?.("data-sveltenode")
				HierarchyUtil.handleDrop(event, entityDragged, node ? Engine.entities.get(node) : undefined)
			},
			onDragOver: (_, ev) => {
				if (ev.ctrlKey)
					return "Link entities"
				if (ev.shiftKey)
					return "Copy into"
				return "Drop on collection (CTRL to link, SHIFT to copy and link)"
			}
		})
	}
}
