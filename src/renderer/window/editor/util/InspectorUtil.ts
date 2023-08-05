import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import ContentBrowserStore from "../../shared/stores/ContentBrowserStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import EngineResourceLoaderService from "../services/engine/EngineResourceLoaderService"
import FileSystemAPI from "../../../engine/core/lib/utils/FileSystemAPI"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"
import LightComponent from "../../../engine/core/components/LightComponent"
import LightsAPI from "../../../engine/core/lib/utils/LightsAPI"
import CameraComponent from "../../../engine/core/components/CameraComponent"
import EngineStore from "../../shared/stores/EngineStore"
import CameraAPI from "../../../engine/core/lib/utils/CameraAPI"
import EditorUtil from "./EditorUtil"
import type Entity from "../../../engine/core/instances/Entity";
import type Component from "../../../engine/core/components/Component";

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

    static getEntityTabs(components) {
        const result = [

        ]
        return [
            {
                icon: "settings",
                label: LocalizationEN.ENTITY_PROPERTIES,
                index: -1,
                color: "var(--pj-accent-color-secondary)"
            },
            {divider: true},
            ...Components.map((c, i) => ({
                icon: EditorUtil.getComponentIcon(c.componentKey),
                label: EditorUtil.getComponentLabel(c.componentKey),
                index: i, color: "var(--pj-accent-color-tertiary)"
            }))
        ]
    }

    static updateEntityComponent(entity:Entity, key:string, value:any, component:typeof Component) {
        if (component instanceof LightComponent) {
            entity.needsLightUpdate = true
            LightsAPI.packageLights(true)
        }
        if (component instanceof CameraComponent) {
            entity.__cameraNeedsUpdate = true
        }
        component[key] = value
        if (component.componentKey === Components.CAMERA && entity.id === EngineStore.getData().focusedCamera)
            CameraAPI.updateViewTarget(entity)
    }

    static removeComponent(entity, index, key) {
        if (!entity)
            return
        if (index != null) {
            entity.scripts[index] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        } else
            entity.removeComponent(key)

        EntityHierarchyService.updateHierarchy()
        EntitySelectionStore.updateStore({array: EntitySelectionStore.getEntitiesSelected()})
    }

    static async handleComponentDrop(entity, data) {
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
                    if (!entity.meshComponent) {
                        entity.addComponent(Components.MESH)
                        entity.addComponent(Components.CULLING)
                    }
                    await EngineResourceLoaderService.load(id, true)
                    entity.meshComponent.meshID = id
                    break
                case "MATERIAL":
                    entity.meshComponent.materialID = id
                    break
                case "IMAGE":
                    (entity.addComponent(Components.SPRITE)).imageID = await FileSystemAPI.loadTexture(id)
                    break
            }
        } catch (err) {
            console.error(err)
        }

    }

    static #getItemFound(id) {
        const filesStoreData = ContentBrowserStore.getData()
        let type = "SCRIPT"
        let itemFound = filesStoreData.Components.find(s => s.registryID === id)
        if (!itemFound) {
            itemFound = filesStoreData.meshes.find(s => s.registryID === id)
            type = "MESH"
        }
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
