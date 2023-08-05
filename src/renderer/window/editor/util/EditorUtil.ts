import ScriptsAPI from "../../../engine/core/lib/utils/ScriptsAPI"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import EngineStore from "../../shared/stores/EngineStore"
import Entity from "../../../engine/core/instances/Entity"
import Engine from "../../../engine/core/Engine"
import ExecutionService from "../services/engine/ExecutionService"
import CameraAPI from "../../../engine/core/lib/utils/CameraAPI"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"
import SettingsStore from "../../shared/stores/SettingsStore"
import QueryAPI from "../../../engine/core/lib/utils/QueryAPI"
import GIZMOS from "../../../../shared/enums/Gizmos"
import ElectronResources from "../../shared/lib/ElectronResources"
import TabsStoreUtil from "./TabsStoreUtil"
import ContentBrowserUtil from "./ContentBrowserUtil"
import GizmoState from "../../../engine/tools/gizmo/util/GizmoState";
import GizmoUtil from "../../../engine/tools/gizmo/util/GizmoUtil";

export default class EditorUtil {
    static async componentConstructor(entity, scriptID, autoUpdate = true) {
        await ScriptsAPI.linkScript(entity, scriptID)
        if (autoUpdate)
            EntitySelectionStore.updateStore({array: EntitySelectionStore.getEntitiesSelected()})
        ToastNotificationSystem.getInstance().success(LocalizationEN.ADDED_COMPONENT)
    }

    static focusOnCamera(cameraTarget) {
        const engineInstance = EngineStore.getInstance()
        const focused = engineInstance.data.focusedCamera
        const isCamera = cameraTarget instanceof Entity
        if (!focused || isCamera && cameraTarget.id !== focused) {
            const current = isCamera ? cameraTarget : Engine.entities.get(EntitySelectionStore.getMainEntity())
            if (current && current.cameraComponent) {
                ExecutionService.cameraSerialization = CameraAPI.serializeState()
                EditorCameraSystem.stopTracking()
                CameraAPI.updateViewTarget(current)
                engineInstance.updateStore({focusedCamera: current.id})
            }
        } else {
            CameraAPI.restoreState(ExecutionService.cameraSerialization)
            EditorCameraSystem.startTracking()
            engineInstance.updateStore({focusedCamera: undefined})
        }
    }

    static getComponentIcon(key) {
        switch (key) {
            case Components.MESH:
                return "category"
            case Components.LIGHT:
                return "light_mode"
            case Components.CAMERA:
                return "videocam"
            case Components.ATMOSPHERE:
                return "wb_twilight"
            case Components.LIGHT_PROBE:
                return "lens_blur"
            case "TRANSFORMATION":
                return "transform"
            case Components.DECAL:
                return "layers"
            case Components.SPRITE:
                return "image"
            case Components.PHYSICS_COLLIDER:
                return "compare_arrows"
            case Components.RIGID_BODY:
                return "language"
            case Components.CULLING:
                return "disabled_visible"
            case Components.UI:
                return "widgets"
            default:
                return "code"
        }
    }

    static getComponentLabel(component) {
        switch (component) {
            case Components.MESH:
                return LocalizationEN.MESH
            case Components.CAMERA:
                return LocalizationEN.CAMERA
            case Components.SPRITE:
                return LocalizationEN.SPRITE
            case Components.DECAL:
                return LocalizationEN.DECAL
            case Components.LIGHT:
                return LocalizationEN.LIGHT
            case Components.ATMOSPHERE:
                return LocalizationEN.ATMOSPHERE_RENDERER
            case Components.LIGHT_PROBE:
                return LocalizationEN.LIGHT_PROBE
            case Components.PHYSICS_COLLIDER:
                return LocalizationEN.PHYSICS_COLLIDER
            case Components.RIGID_BODY:
                return LocalizationEN.RIGID_BODY
            case Components.CULLING:
                return LocalizationEN.CULLING
            case Components.UI:
                return LocalizationEN.UI_WRAPPER
        }
    }

    static async importFile(currentDirectory) {
        const {filesImported} = await EditorUtil.getCall<MutableObject>(IPCRoutes.FILE_DIALOG, {currentDirectory: currentDirectory.id}, false)
        if (filesImported.length > 0) {
            ToastNotificationSystem.getInstance().success(LocalizationEN.IMPORT_SUCCESSFUL)
            await ContentBrowserUtil.refreshFiles()
        }
    }

    static openBottomView(view) {
        const settingsStore = SettingsStore.getInstance()
        const views = [...settingsStore.data.views]
        const tab = views[settingsStore.data.currentView]
        const existingTab = tab.bottom[0].findIndex(v => v?.type === view)
        if (existingTab > -1) {
            TabsStoreUtil.updateByAttributes("bottom", 0, existingTab)
            return
        }

        if (tab.bottom.length > 0)
            tab.bottom[0].push({type: view, color: [255, 255, 255]})
        else
            tab.bottom[0] = [{type: view, color: [255, 255, 255]}]

        settingsStore.updateStore({views})
        TabsStoreUtil.updateByAttributes("bottom", 0, tab.bottom[0].length - 1)
    }

    static async resolveFileName(path: string, ext: string): Promise<string> {
        return await EditorUtil.getCall(IPCRoutes.RESOLVE_NAME, {path, ext}, false)
    }

    static selectEntityHierarchy(start: Entity): string[] {
        const result: string[] = []
        const direct = start.children.array
        direct.forEach(d => result.push(...EditorUtil.selectEntityHierarchy(d)))
        result.push(...direct.map(c => c.id))
        return result
    }

    static snap(grid?: number) {
        const selected = EntitySelectionStore.getEntitiesSelected()
        for (let i = 0; i < selected.length; i++) {
            const entity = QueryAPI.getEntityByID(selected[i])
            const currentGizmo = SettingsStore.getData().gizmo

            switch (currentGizmo) {
                case GIZMOS.TRANSLATION: {
                    const g = grid ? grid : GizmoState.translationGridSize
                    entity._translation[0] = GizmoUtil.nearestX(entity._translation[0], g)
                    entity._translation[1] = GizmoUtil.nearestX(entity._translation[1], g)
                    entity._translation[2] = GizmoUtil.nearestX(entity._translation[2], g)
                    break
                }
                case GIZMOS.SCALE: {
                    const g = grid ? grid : GizmoState.scalingGridSize
                    entity._scaling[0] = GizmoUtil.nearestX(entity._scaling[0], g)
                    entity._scaling[1] = GizmoUtil.nearestX(entity._scaling[1], g)
                    entity._scaling[2] = GizmoUtil.nearestX(entity._scaling[2], g)
                    break
                }
                case GIZMOS.ROTATION: {
                    const g = grid ? grid : GizmoState.rotationGridSize
                    entity._rotationQuaternion[0] = GizmoUtil.nearestX(entity._rotationQuaternion[0], g)
                    entity._rotationQuaternion[1] = GizmoUtil.nearestX(entity._rotationQuaternion[1], g)
                    entity._rotationQuaternion[2] = GizmoUtil.nearestX(entity._rotationQuaternion[2], g)
                    entity._rotationQuaternion[3] = GizmoUtil.nearestX(entity._rotationQuaternion[2], g)
                    break
                }
            }
            entity.changed = true
        }
    }

    static updateView(key, newView) {
        const settingsData = SettingsStore.getData()
        const view = settingsData.views[settingsData.currentView]
        const copy = [...settingsData.views]
        copy[settingsData.currentView] = {...view, [key]: newView}

        SettingsStore.updateStore({views: copy})
    }

    static getCall<T>(channel, data, addMiddle = true): Promise<T> {
        return new Promise(resolve => {
            let listenID = crypto.randomUUID()
            if (data.listenID)
                listenID = data.listenID
            ElectronResources.ipcRenderer.once(channel + (addMiddle ? "-" : "") + listenID, (ev, data: T) => {
                resolve(data)
            })

            ElectronResources.ipcRenderer.send(channel, {...data, listenID})
        })
    }
}
