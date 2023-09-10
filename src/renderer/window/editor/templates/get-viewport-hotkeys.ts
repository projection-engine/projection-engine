import ViewportActionUtil from "../services/ViewportActionUtil"
import SettingsStore from "../../shared/stores/SettingsStore"
import GIZMOS from "../../../../shared/enums/Gizmos"
import EditorActionHistory from "../services/EditorActionHistory"
import GizmoTransformationType from "../../../../shared/enums/GizmoTransformationType"
import CAMERA_ROTATIONS from "../../../engine/tools/static/CAMERA_ROTATIONS"
import EditorLevelService from "../services/engine/EditorLevelService"
import EditorCameraSystem from "../../../engine/tools/systems/EditorCameraSystem"
import ContextMenuOption from "../../shared/lib/context-menu/templates/ContextMenuOptions"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import EngineStateService from "../services/engine/EngineStateService"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import EditorUtil from "../util/EditorUtil"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import {vec3} from "gl-matrix";
import EditorEntityManager from "../../../engine/tools/managers/EditorEntityManager";


export default function getViewportHotkeys(): { [key: string]: ContextMenuOption } {
    const viewportHotkeys = SettingsStore.getData().viewportHotkeys
    return {
        DUPLICATE: {
            label: "Duplicate active",
            callback: () => {
                const t = EntitySelectionStore.getMainEntity()
                EditorEntityManager.getEntity(t)?.clone?.()
            },
            require: viewportHotkeys.DUPLICATE,
        },

        FOCUS_ON_CAMERA: {
            label: LocalizationEN.FOCUS_ON_CAMERA,
            callback: EditorUtil.focusOnCamera,
            require: viewportHotkeys.FOCUS_ON_CAMERA,
        },
        SHOW_SELECTED: {
            label: LocalizationEN.SHOW_SELECTED,
            callback: EntityHierarchyService.openTree,
            require: viewportHotkeys.SHOW_SELECTED,
        },

        SAVE: {
            label: "Save",
            require: viewportHotkeys.SAVE,
            callback: EditorLevelService.getInstance().save
        },
        INVERT_SELECTION: {
            label: "Invert selection",
            require: viewportHotkeys.INVERT_SELECTION,
            callback: () => ViewportActionUtil.invertSelection()
        },
        SELECT_ALL: {
            label: "Select all",
            require: viewportHotkeys.SELECT_ALL,
            callback: () => ViewportActionUtil.selectAll()
        },
        SELECT_NONE: {
            label: "Select none",
            require: viewportHotkeys.SELECT_NONE,
            callback: () => EntitySelectionStore.setEntitiesSelected([])
        },
        TRANSLATION_GIZMO: {

            require: viewportHotkeys.TRANSLATION_GIZMO,
            callback: () => {
                SettingsStore.updateStore({gizmo: GIZMOS.TRANSLATION})
            }
        },
        SELECT_HIERARCHY: {
            require: viewportHotkeys.SELECT_HIERARCHY,
            label: "Select hierarchy",
            callback: () => {
                const t = EntitySelectionStore.getMainEntity()
                if (!t)
                    return
                const toSelect: EngineEntity[] = [t, ...EditorUtil.selectEntityHierarchy(t)]
                EntitySelectionStore.setEntitiesSelected([...EntitySelectionStore.getEntitiesSelected(), ...toSelect])
            },

        },
        HIDE_ACTIVE: {
            label: "Hide active",
            callback: () => {
                const selected = EntitySelectionStore.getEntitiesSelected()
                for (let i = 0; i < selected.length; i++)
                    EngineStateService.toggleEntityVisibility(selected[i], true)
                EntityHierarchyService.updateHierarchy()
            },
            require: viewportHotkeys.HIDE_ACTIVE,
        },
        SNAP_TO_ORIGIN: {
            label: "Snap to origin",
            callback: () => {
                const selected = EntitySelectionStore.getEntitiesSelected()
                for (let i = 0; i < selected.length; i++) {
                    const component = EntityManager.getComponent<TransformationComponent>(selected[i], Components.TRANSFORMATION)
                    if (!component)
                        continue
                    vec3.copy(component.translation, [0, 0, 0])
                    component.changed = true
                }
            },
            require: viewportHotkeys.SNAP_TO_ORIGIN,
        },

        ROUND_TRANSFORMATION: {
            label: "Round transformation",
            callback: () => EditorUtil.snap(1),
            require: viewportHotkeys.ROUND_TRANSFORMATION,
        },

        CYCLE_GIZMOS: {
            label: "Cycle gizmos",
            callback: () => {
                const settingsInstance = SettingsStore.getInstance()
                switch (settingsInstance.data.gizmo) {
                    case GIZMOS.TRANSLATION:
                        settingsInstance.updateStore({gizmo: GIZMOS.SCALE})
                        break
                    case GIZMOS.SCALE:
                        settingsInstance.updateStore({gizmo: GIZMOS.ROTATION})
                        break
                    case GIZMOS.ROTATION:
                        settingsInstance.updateStore({gizmo: GIZMOS.NONE})
                        break
                    case GIZMOS.NONE:
                        settingsInstance.updateStore({gizmo: GIZMOS.TRANSLATION})
                        break
                }
            },
            require: viewportHotkeys.SWITCH_TRANSFORMATION,
        },
        SWITCH_TRANSFORMATION: {
            label: "Switch transformation",
            callback: () => {
                const settingsInstance = SettingsStore.getInstance()
                const newT = settingsInstance.data.transformationType === GizmoTransformationType.GLOBAL ? GizmoTransformationType.RELATIVE : GizmoTransformationType.GLOBAL
                settingsInstance.updateStore({transformationType: newT})
            },
            require: viewportHotkeys.SWITCH_TRANSFORMATION,
        },
        SNAP_TO_GRID: {
            label: "Snap to grid",
            callback: EditorUtil.snap,
            require: viewportHotkeys.SNAP_TO_GRID,
        },
        FOCUS: {
            label: "Focus on active",
            require: viewportHotkeys.FOCUS,
            callback: ViewportActionUtil.focus
        },
        SCALE_GIZMO: {
            require: viewportHotkeys.SCALE_GIZMO,
            callback: () => SettingsStore.updateStore({gizmo: GIZMOS.SCALE})
        },
        ROTATION_GIZMO: {
            require: viewportHotkeys.ROTATION_GIZMO,
            callback: () => SettingsStore.updateStore({gizmo: GIZMOS.ROTATION})
        },
        UNDO: {
            require: viewportHotkeys.UNDO,
            callback: EditorActionHistory.undo
        },
        REDO: {
            require: viewportHotkeys.REDO,
            callback: EditorActionHistory.redo
        },
        GROUP: {
            label: "Group selected",
            require: viewportHotkeys.GROUP,
            callback: ViewportActionUtil.group
        },
        FIXATE_ACTIVE: {
            label: "Fixate active",
            require: viewportHotkeys.FIXATE_ACTIVE,
            callback: ViewportActionUtil.fixateActive
        },

        COPY: {
            label: "Copy",
            require: viewportHotkeys.COPY,
            callback: ViewportActionUtil.copy
        },

        DELETE: {
            label: "Delete",
            require: viewportHotkeys.DELETE,
            callback: ViewportActionUtil.deleteSelected
        },
        PASTE: {

            label: "Paste",
            require: viewportHotkeys.PASTE,
            callback: ViewportActionUtil.paste
        },


        CAMERA_TOP: {

            require: viewportHotkeys.CAMERA_TOP,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.TOP)
        },
        CAMERA_BOTTOM: {

            require: viewportHotkeys.CAMERA_BOTTOM,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.BOTTOM)
        },
        CAMERA_LEFT: {

            require: viewportHotkeys.CAMERA_LEFT,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.LEFT)
        },
        CAMERA_RIGHT: {

            require: viewportHotkeys.CAMERA_RIGHT,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.RIGHT)
        },
        CAMERA_FRONT: {
            require: viewportHotkeys.CAMERA_FRONT,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.FRONT)
        },
        CAMERA_BACK: {
            require: viewportHotkeys.CAMERA_BACK,
            callback: () => EditorCameraSystem.rotate(CAMERA_ROTATIONS.BACK)
        }

    }
}
