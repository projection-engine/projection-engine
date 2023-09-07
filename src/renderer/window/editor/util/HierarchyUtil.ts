import HierarchyToRenderElement from "../views/hierarchy/template/ToRenderElement"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import EditorEntity from "../../../engine/tools/EditorEntity"
import EditorUtil from "./EditorUtil"
import HotKeysController from "../../shared/lib/HotKeysController";
import getViewportHotkeys from "../templates/get-viewport-hotkeys";
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";
import EntityManager from "@engine-core/managers/EntityManager";
import EditorEntityManager from "../../../engine/tools/EditorEntityManager";

export default class HierarchyUtil {
    static buildTree(openTree: {
        [key: string]: boolean
    }, searchString: string, filteredComponent: string): HierarchyToRenderElement[] {

        const hierarchy = EntityHierarchyService.hierarchy
        let data: HierarchyToRenderElement[] = []
        let blockStart = -1
        let minDepth = -1
        let blockEnd = -1
        const hasSearch = searchString != null || filteredComponent != null
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
                    HierarchyUtil.#searchTree(blockStart, blockEnd, data, hierarchy, searchString, filteredComponent)
                if (minDepth > hierarchy[i + 1]?.depth) {
                    blockStart = -1
                    minDepth = -1
                }
            } else {
                if (!node) {
                    node = EditorEntityManager.getEntity(current.component.entity)
                    if (openTree[node.id] && openTree[EntityManager.getParent(node.id)])
                        data.push(current)
                    continue
                }
                if (!EntityManager.hasParent(node.id) || openTree[EntityManager.getParent(node.id)])
                    data.push(current)
            }
        }
        if (hasSearch) {
            data = data.filter(e => e !== undefined && e.node !== undefined)
        }
        return data
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

    static handleDrop(event, entityDragged: EditorEntity | EditorEntity[], dropTargetEntity: EditorEntity | undefined) {
        if (!dropTargetEntity) {
            return
        }
        const toSave = Array.isArray(entityDragged) ? entityDragged : [entityDragged]
        const newSelection = []
        let noneCreate = true
        for (let i = 0; i < toSave.length; i++) {
            const currentEntity = <EditorEntity>toSave[i]
            if (event.ctrlKey) {
                EntityManager.addParent(currentEntity.id, dropTargetEntity?.id)
            } else if (event.shiftKey) {
                const clone = currentEntity.clone()
                clone.setParent(dropTargetEntity?.id)
                noneCreate = false
                newSelection.push(clone.id)
            }
        }

        if (noneCreate) {
            EntitySelectionStore.setEntitiesSelected(newSelection)
            EntityHierarchyService.updateHierarchy()
        }
    }

    static mapComponents(entity: EditorEntity) {
        return entity.allComponents.map(e => ({
            icon: EditorUtil.getComponentIcon(e.getComponentKey()),
            label: EditorUtil.getComponentLabel(e.getComponentKey())
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
        return (!search || search && node.name.includes(search)) && (!filteredComponent || filteredComponent && node.Components.has(filteredComponent))
    }

    static updateSelection(entityID: EngineEntity, ctrlKey?: boolean) {
        if (ctrlKey) {
            const entitiesSelected = EntitySelectionStore.getEntitiesSelected()
            if (!entitiesSelected.includes(entityID))
                EntitySelectionStore.setEntitiesSelected([...entitiesSelected, entityID])
            else
                EntitySelectionStore.setEntitiesSelected(entitiesSelected.filter(e => e !== entityID))
        } else
            EntitySelectionStore.setEntitiesSelected(entityID)
    }

    static initializeView(draggable, ref: HTMLElement) {
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
                HierarchyUtil.handleDrop(event, entityDragged, node ? EditorEntityManager.getEntity(node as EngineEntity) : undefined)
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
