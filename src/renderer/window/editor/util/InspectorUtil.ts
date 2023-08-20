import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import ContentBrowserStore from "../../shared/stores/ContentBrowserStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"
import EngineStore from "../../shared/stores/EngineStore"
import CameraManager from "@engine-core/managers/CameraManager"
import EditorUtil from "./EditorUtil"
import type EditorEntity from "../../../engine/tools/EditorEntity";
import type Component from "@engine-core/lib/components/Component";
import {Components,} from "@engine-core/engine.enum";
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import SpriteComponent from "@engine-core/lib/components/SpriteComponent";
import EntityManager from "@engine-core/managers/EntityManager";

export default class InspectorUtil {
    static compareObjects(obj1, obj2) {
        let isValid = true
        Object.entries(obj1).forEach(([k, v]) => {
            if (k === "value")
                return

            if (typeof obj2[k] === "object")
                isValid = isValid && InspectorUtil.compareObjects(v, obj2[k])
            else if (obj2[k] === v)
                isValid = isValid && true

        })
        return isValid
    }

    static getEntityTabs(components: Component[]) {
        return [
            {
                icon: "settings",
                label: LocalizationEN.ENTITY_PROPERTIES,
                index: -1,
                color: "var(--pj-accent-color-secondary)"
            },
            {divider: true},
            ...components.map((c, i) => ({
                icon: EditorUtil.getComponentIcon(c.getComponentKey()),
                label: EditorUtil.getComponentLabel(c.getComponentKey()),
                index: i, color: "var(--pj-accent-color-tertiary)"
            }))
        ]
    }

    static updateEntityComponent(entity: EditorEntity, key: string, value: any, component: Component) {
        EntityManager.updateProperty(entity.id, component.getComponentKey(), key, value)
        if (component.getComponentKey() === Components.CAMERA && entity.id === EngineStore.getData().focusedCamera) {
            CameraManager.updateViewTarget(entity)
        }
    }

    static removeComponent(entity: EditorEntity, key: Components) {
        if (!entity)
            return
        entity.removeComponent(key)
        EntityHierarchyService.updateHierarchy()
        EntitySelectionStore.updateStore({array: EntitySelectionStore.getEntitiesSelected()})
    }

    static async handleComponentDrop(entity: EditorEntity, data) {
        try {
            const id = JSON.parse(data)[0]
            const type = InspectorUtil.#getItemFound(id)
            if (type == null)
                return

            switch (type) {
                case "SCRIPT":
                    await EditorUtil.componentConstructor(entity, id, true)
                    break
                case "MESH":
                    if (!entity.hasComponent(Components.MESH))
                        entity.addComponent(Components.MESH)
                    entity.getComponent<MeshComponent>(Components.MESH).meshID = id
                    break
                case "MATERIAL":
                    if (!entity.hasComponent(Components.MESH))
                        entity.addComponent(Components.MESH)
                    entity.getComponent<MeshComponent>(Components.MESH).materialID = id
                    break
                case "IMAGE":
                    if (!entity.hasComponent(Components.SPRITE))
                        entity.addComponent(Components.SPRITE)
                    entity.getComponent<SpriteComponent>(Components.SPRITE).imageID = id
                    break
            }
        } catch (err) {
            console.error(err)
        }

    }

    static #getItemFound(id) {
        const filesStoreData = ContentBrowserStore.getData()
        let itemFound = filesStoreData.meshes.find(s => s.registryID === id)
        let type = "MESH"
        if (!itemFound) {
            itemFound = filesStoreData.textures.find(s => s.registryID === id)
            type = "IMAGE"
        }
        if (!itemFound) {
            itemFound = filesStoreData.materials.find(s => s.registryID === id)
            type = "MATERIAL"
        }

        if (!itemFound) {
            ToastNotificationSystem.getInstance().error(LocalizationEN.FILE_NOT_FOUND)
            return null
        }
        return type
    }


}
