import ScriptsManager from "@engine-core/managers/ScriptsManager"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore"
import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import EngineStore from "../../shared/stores/EngineStore"
import ExecutionService from "../services/engine/ExecutionService"
import CameraManager from "@engine-core/managers/CameraManager"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"
import SettingsStore from "../../shared/stores/SettingsStore"
import GIZMOS from "../../../../shared/enums/Gizmos"
import ElectronResources from "../../shared/lib/ElectronResources"
import TabsStoreUtil from "./TabsStoreUtil"
import ContentBrowserUtil from "./ContentBrowserUtil"
import GizmoState from "../../../engine/tools/gizmo/util/GizmoState";
import GizmoUtil from "../../../engine/tools/gizmo/util/GizmoUtil";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import CameraComponent from "@engine-core/lib/components/CameraComponent";

export default class EditorUtil {
    static async componentConstructor(entity, scriptID, autoUpdate = true) {
        await ScriptsManager.linkScript(entity, scriptID)
        if (autoUpdate)
            EntitySelectionStore.updateStore({array: EntitySelectionStore.getEntitiesSelected()})
        ToastNotificationSystem.getInstance().success(LocalizationEN.ADDED_COMPONENT)
    }

    static focusOnCamera(cameraTarget?: EngineEntity) {
        const engineInstance = EngineStore.getInstance()
        const focused = EngineStore.getData().focusedCamera
        if (!focused || cameraTarget != null && cameraTarget !== focused) {
            const component = EntityManager.getComponent<CameraComponent>(cameraTarget ?? EntitySelectionStore.getMainEntity(), Components.CAMERA)
            if (component != null) {
                ExecutionService.cameraSerialization = CameraManager.serializeState()
                EditorCameraSystem.stopTracking()
                CameraManager.updateViewTarget(component)
                engineInstance.updateStore({focusedCamera: component.entity})
            }
        } else {
            CameraManager.restoreState(ExecutionService.cameraSerialization)
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

    static selectEntityHierarchy(start: EngineEntity): EngineEntity[] {
        const result: EngineEntity[] = []
        const direct = EntityManager.getChildren(start)
        direct.forEach(d => result.push(...EditorUtil.selectEntityHierarchy(d)))
        result.push(...direct)
        return result
    }

    static snap(grid?: number) {
        const selected = EntitySelectionStore.getEntitiesSelected()
        for (let i = 0; i < selected.length; i++) {
            const entity = selected[i]
            const currentGizmo = SettingsStore.getData().gizmo
            const component = EntityManager.getComponent<TransformationComponent>(entity, Components.TRANSFORMATION)
            if (!component) {
                continue
            }
            switch (currentGizmo) {
                case GIZMOS.TRANSLATION: {
                    const g = grid ? grid : GizmoState.translationGridSize
                    component.translation[0] = GizmoUtil.nearestX(component.translation[0], g)
                    component.translation[1] = GizmoUtil.nearestX(component.translation[1], g)
                    component.translation[2] = GizmoUtil.nearestX(component.translation[2], g)
                    break
                }
                case GIZMOS.SCALE: {
                    const g = grid ? grid : GizmoState.scalingGridSize
                    component.scaling[0] = GizmoUtil.nearestX(component.scaling[0], g)
                    component.scaling[1] = GizmoUtil.nearestX(component.scaling[1], g)
                    component.scaling[2] = GizmoUtil.nearestX(component.scaling[2], g)
                    break
                }
                case GIZMOS.ROTATION: {
                    const g = grid ? grid : GizmoState.rotationGridSize
                    component.rotationQuaternion[0] = GizmoUtil.nearestX(component.rotationQuaternion[0], g)
                    component.rotationQuaternion[1] = GizmoUtil.nearestX(component.rotationQuaternion[1], g)
                    component.rotationQuaternion[2] = GizmoUtil.nearestX(component.rotationQuaternion[2], g)
                    component.rotationQuaternion[3] = GizmoUtil.nearestX(component.rotationQuaternion[2], g)
                    break
                }
            }
            component.changed = true
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
