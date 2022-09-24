import KEYS from "../../../public/engine/static/KEYS";
import EngineStore from "../stores/EngineStore";
import ViewportActions from "../libs/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import GIZMOS from "../data/GIZMOS";
import SelectionStore from "../stores/SelectionStore";
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import QueryAPI from "../../../public/engine/production/apis/utils/QueryAPI";
import {GizmoSystem} from "../../../public/engine/editor";
import selectEntityHierarchy from "./utils/select-entity-hierarchy";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";

const toRad = Math.PI / 180
export default {
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
        require: [KEYS.ShiftLeft, KEYS.KeyD]
    },

    SAVE: {
        label: "Save",
        require: [KEYS.ControlLeft, KEYS.KeyS],
        callback: EngineStore.save
    },
    INVERT_SELECTION: {
        label: "Invert selection",
        require: [KEYS.ControlLeft, KEYS.KeyI],
        callback: () => ViewportActions.invertSelection()
    },
    SELECT_ALL: {
        label: "Select all",
        require: [KEYS.KeyA],
        callback: () => ViewportActions.selectAll()
    },
    SELECT_NONE: {
        label: "Select none",
        require: [KEYS.AltLeft, KEYS.KeyA],
        callback: () => SelectionStore.engineSelected = []
    },
    TRANSLATION_GIZMO: {

        require: [KEYS.KeyG],
        callback: () => {
            const settings = SettingsStore.data
            SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
        }
    },
    SELECT_HIERARCHY: {
        require: [KEYS.KeyH],
        label: "Select hierarchy",
        callback: () => {
            const t = SelectionStore.mainEntity
            if (!t)
                return
            const toSelect = [t, ...selectEntityHierarchy(QueryAPI.getEntityByID(t))]
            SelectionStore.engineSelected = [...SelectionStore.engineSelected, ...toSelect]

        },
    },
    SNAP_TO_GRID: {
        label: "Snap to grid",
        icon: "grid_4x4",
        callback: () => {
            const selected = SelectionStore.engineSelected
            for (let i = 0; i < selected.length; i++) {
                const entity = QueryAPI.getEntityByID(selected[i])
                const currentGizmo = SettingsStore.data.gizmo

                switch (currentGizmo) {
                    case GIZMOS.TRANSLATION: {
                        const g = GizmoSystem.translationGizmo.gridSize
                        entity._translation[0] = Math.round(entity._translation[0] / g) * g
                        entity._translation[1] = Math.round(entity._translation[1] / g) * g
                        entity._translation[2] = Math.round(entity._translation[2] / g) * g
                        break
                    }
                    case GIZMOS.SCALE: {
                        const g = GizmoSystem.scaleGizmo.gridSize
                        entity._scaling[0] = Math.round(entity._scaling[0] / g) * g
                        entity._scaling[1] = Math.round(entity._scaling[1] / g) * g
                        entity._scaling[2] = Math.round(entity._scaling[2] / g) * g
                        break
                    }
                    case GIZMOS.ROTATION: {
                        const g = GizmoSystem.rotationGizmo.gridSize * toRad
                        entity._rotationQuat[0] = Math.round(entity._rotationQuat[0] / g) * g
                        entity._rotationQuat[1] = Math.round(entity._rotationQuat[1] / g) * g
                        entity._rotationQuat[2] = Math.round(entity._rotationQuat[2] / g) * g
                        entity._rotationQuat[3] = Math.round(entity._rotationQuat[2] / g) * g
                        break
                    }
                }
                entity.__changedBuffer[0] = 1
            }
        },
        require: [KEYS.ShiftLeft, KEYS.ControlLeft, KEYS.Tab],
    },
    FOCUS: {
        icon: "place",
        label: "Focus on active",
        require: [KEYS.Home],
        callback: ViewportActions.focus
    },
    SCALE_GIZMO: {
        require: [KEYS.KeyS],
        callback: () => {
            const settings = SettingsStore.data
            SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})
        }
    },
    ROTATION_GIZMO: {
        require: [KEYS.KeyR],
        callback: () => {
            const settings = SettingsStore.data
            SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})
        }
    },
    UNDO: {
        require: [KEYS.ControlLeft, KEYS.KeyZ],
        callback: () => ActionHistoryAPI.undo()
    },
    REDO: {
        require: [KEYS.ControlLeft, KEYS.KeyY],
        callback: () => ActionHistoryAPI.redo()
    },
    GROUP: {
        label: "Group selected",
        require: [KEYS.ControlLeft, KEYS.KeyP],
        callback: () => ViewportActions.group()
    },
    FIXATE_ACTIVE: {
        icon: "push_pin",
        label: "Fixate active",
        require: [KEYS.ControlLeft, KEYS.KeyF],
        callback: () => ViewportActions.fixateActive()
    },

    COPY: {
        icon: "copy_all",
        label: "Copy",
        require: [KEYS.ControlLeft, KEYS.KeyC],
        callback: () => ViewportActions.copy()
    },

    DELETE: {
        icon: "delete_forever",
        label: "Delete",
        require: [KEYS.Delete],
        callback: () => ViewportActions.deleteSelected()
    },
    PASTE: {

        icon: "content_paste_go",
        label: "Paste",
        require: [KEYS.ControlLeft, KEYS.KeyV],
        callback: () => ViewportActions.paste()
    }

}