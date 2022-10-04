import EngineStore from "../../stores/EngineStore";
import ViewportActions from "../../libs/ViewportActions";
import SettingsStore from "../../stores/SettingsStore";
import GIZMOS from "../../data/GIZMOS";
import SelectionStore from "../../stores/SelectionStore";
import ActionHistoryAPI from "../../libs/ActionHistoryAPI";
import QueryAPI from "../../../../public/engine/production/apis/utils/QueryAPI";
import {CameraTracker} from "../../../../public/engine/editor";
import selectEntityHierarchy from "../utils/select-entity-hierarchy";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities";
import snap from "../utils/snap";
import TRANSFORMATION_TYPE from "../../data/TRANSFORMATION_TYPE";
import EntityConstructor from "../../libs/EntityConstructor";
import {Engine} from "../../../../public/engine/production";
import {v4} from "uuid";
import CAMERA_ROTATIONS from "../../../../public/engine/editor/data/CAMERA_ROTATIONS";
import CameraAPI from "../../../../public/engine/production/apis/CameraAPI";
import LevelController from "../../libs/LevelController";

function focusCamera(current, cameras) {
    if (current > -1 && cameras[current] != null) {
        CameraAPI.updateViewTarget(cameras[current])
        const transformationMatrix = CameraAPI.staticViewMatrix
        CameraTracker.gizmoReference.style.transform = `translateZ(calc(var(--cube-size) * -3)) matrix3d(${transformationMatrix})`
    } else
        CameraTracker.update(false)

    EngineStore.updateStore({...EngineStore.engine, focusedCamera: cameras[current]?.id})
}

export default function viewportHotkeys(settings) {

    return {
        DUPLICATE: {
            label: "Duplicate active",
            callback: () => {
                const t = SelectionStore.mainEntity
                if (!t)
                    return
                const entity = QueryAPI.getEntityByID(t)
                if (entity)
                    dispatchRendererEntities({
                        type: ENTITY_ACTIONS.ADD,
                        payload: entity.clone()
                    })
            },
            icon: "content_copy",
            require: settings.viewportHotkeys.DUPLICATE,
        },
        SWITCH_BETWEEN_CAMERAS: {
            label: "Switch between cameras",
            callback: () => {
                const cameras = Engine.data.cameras
                let current = cameras.findIndex(v => v.id === EngineStore.engine.focusedCamera)
                if (cameras.length === 0) {
                    if (EngineStore.engine.focusedCamera != null)
                        EngineStore.updateStore({...EngineStore.engine, focusedCamera: undefined})
                    return
                }
                if (current > -1 && cameras.length > 0)
                    current = 0
                else current++
                if (current > cameras.length - 1)
                    current = -1

                focusCamera(current, cameras)
            },
            require: settings.viewportHotkeys.SWITCH_BETWEEN_CAMERAS,
        },
        FOCUS_ON_CAMERA: {
            label: "Focus on camera",
            callback: () => {
                const cameras = Engine.data.cameras
                const current = cameras.findIndex(v => v.id === SelectionStore.mainEntity)
                focusCamera(current, cameras)
            },
            require: settings.viewportHotkeys.FOCUS_ON_CAMERA,
        },

        SAVE: {
            label: "Save",
            require: settings.viewportHotkeys.SAVE,
            callback: LevelController.save
        },
        INVERT_SELECTION: {
            label: "Invert selection",
            require: settings.viewportHotkeys.INVERT_SELECTION,
            callback: () => ViewportActions.invertSelection()
        },
        SELECT_ALL: {
            label: "Select all",
            require: settings.viewportHotkeys.SELECT_ALL,
            callback: () => ViewportActions.selectAll()
        },
        SELECT_NONE: {
            label: "Select none",
            require: settings.viewportHotkeys.SELECT_NONE,
            callback: () => SelectionStore.engineSelected = []
        },
        TRANSLATION_GIZMO: {

            require: settings.viewportHotkeys.TRANSLATION_GIZMO,
            callback: () => {
                const settings = SettingsStore.data
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
            }
        },
        SELECT_HIERARCHY: {
            require: settings.viewportHotkeys.SELECT_HIERARCHY,
            label: "Select hierarchy",
            callback: () => {
                const t = SelectionStore.mainEntity
                if (!t)
                    return
                const toSelect = [t, ...selectEntityHierarchy(QueryAPI.getEntityByID(t))]
                SelectionStore.engineSelected = [...SelectionStore.engineSelected, ...toSelect]
            },

        },
        HIDE_ACTIVE: {
            label: "Hide active",
            callback: () => {
                const selected = SelectionStore.engineSelected
                for (let i = 0; i < selected.length; i++)
                    EntityConstructor.hideEntity(Engine.entitiesMap.get(selected[i]), false)
                EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
            },
            require: settings.viewportHotkeys.HIDE_ACTIVE,
        },
        SNAP_TO_ORIGIN: {
            label: "Snap to origin",
            callback: () => {
                const selected = SelectionStore.engineSelected
                for (let i = 0; i < selected.length; i++) {
                    const entity = QueryAPI.getEntityByID(selected[i])
                    entity._translation[0] = 0
                    entity._translation[1] = 0
                    entity._translation[2] = 0
                    entity.__changedBuffer[0] = 1
                }
            },
            require: settings.viewportHotkeys.SNAP_TO_ORIGIN,
        },

        ROUND_TRANSFORMATION: {
            label: "Round transformation",
            callback: () => snap(1),
            require: settings.viewportHotkeys.ROUND_TRANSFORMATION,
        },

        CYCLE_GIZMOS: {
            label: "Cycle gizmos",
            callback: () => {
                switch (settings.gizmo) {
                    case GIZMOS.TRANSLATION:
                        SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})
                        break
                    case GIZMOS.SCALE:
                        SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})
                        break
                    case GIZMOS.ROTATION:
                        SettingsStore.updateStore({...settings, gizmo: GIZMOS.NONE})
                        break
                    case GIZMOS.NONE:
                        SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
                        break
                }
            },
            require: settings.viewportHotkeys.SWITCH_TRANSFORMATION,
        },
        SWITCH_TRANSFORMATION: {
            label: "Switch transformation",
            callback: () => {
                const newT = settings.transformationType === TRANSFORMATION_TYPE.GLOBAL ? TRANSFORMATION_TYPE.RELATIVE : TRANSFORMATION_TYPE.GLOBAL
                SettingsStore.updateStore({...settings, transformationType: newT})
            },
            require: settings.viewportHotkeys.SWITCH_TRANSFORMATION,
        },
        SNAP_TO_GRID: {
            label: "Snap to grid",
            icon: "grid_4x4",
            callback: () => snap(),
            require: settings.viewportHotkeys.SNAP_TO_GRID,
        },
        FOCUS: {
            icon: "place",
            label: "Focus on active",
            require: settings.viewportHotkeys.FOCUS,
            callback: ViewportActions.focus
        },
        SCALE_GIZMO: {
            require: settings.viewportHotkeys.SCALE_GIZMO,
            callback: () => SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})
        },
        ROTATION_GIZMO: {
            require: settings.viewportHotkeys.ROTATION_GIZMO,
            callback: () => {
                const settings = SettingsStore.data
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})
            }
        },
        UNDO: {
            require: settings.viewportHotkeys.UNDO,
            callback: () => ActionHistoryAPI.undo()
        },
        REDO: {
            require: settings.viewportHotkeys.REDO,
            callback: () => ActionHistoryAPI.redo()
        },
        GROUP: {
            label: "Group selected",
            require: settings.viewportHotkeys.GROUP,
            callback: () => ViewportActions.group()
        },
        FIXATE_ACTIVE: {
            icon: "push_pin",
            label: "Fixate active",
            require: settings.viewportHotkeys.FIXATE_ACTIVE,
            callback: () => ViewportActions.fixateActive()
        },

        COPY: {
            icon: "copy_all",
            label: "Copy",
            require: settings.viewportHotkeys.COPY,
            callback: () => ViewportActions.copy()
        },

        DELETE: {
            icon: "delete_forever",
            label: "Delete",
            require: settings.viewportHotkeys.DELETE,
            callback: () => ViewportActions.deleteSelected()
        },
        PASTE: {

            icon: "content_paste_go",
            label: "Paste",
            require: settings.viewportHotkeys.PASTE,
            callback: () => ViewportActions.paste()
        },


        CAMERA_TOP: {

            require: settings.viewportHotkeys.CAMERA_TOP,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.TOP)
        },
        CAMERA_BOTTOM: {

            require: settings.viewportHotkeys.CAMERA_BOTTOM,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.BOTTOM)
        },
        CAMERA_LEFT: {

            require: settings.viewportHotkeys.CAMERA_LEFT,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.LEFT)
        },
        CAMERA_RIGHT: {

            require: settings.viewportHotkeys.CAMERA_RIGHT,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.RIGHT)
        },
        CAMERA_FRONT: {
            require: settings.viewportHotkeys.CAMERA_FRONT,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.FRONT)
        },
        CAMERA_BACK: {
            require: settings.viewportHotkeys.CAMERA_BACK,
            callback: () => CameraTracker.rotate(CAMERA_ROTATIONS.BACK)
        }

    }
}