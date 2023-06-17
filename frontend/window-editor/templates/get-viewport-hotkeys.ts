import ViewportActionService from "../services/ViewportActionService"
import SettingsStore from "../../shared/stores/SettingsStore"
import GIZMOS from "../static/GIZMOS"
import SelectionStore from "../../shared/stores/SelectionStore"
import EditorActionHistory from "../services/EditorActionHistory"
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI"

import selectEntityHierarchy from "../utils/select-entity-hierarchy"
import snap from "../utils/snap"
import TRANSFORMATION_TYPE from "../static/TRANSFORMATION_TYPE"
import EntityFactoryService from "../services/engine/EntityFactoryService"
import CAMERA_ROTATIONS from "../../../engine-core/tools/static/CAMERA_ROTATIONS"
import LevelService from "../services/engine/LevelService"
import CameraTracker from "../../../engine-core/tools/lib/CameraTracker"

import focusOnCamera from "../utils/focus-on-camera"
import ContextMenuOption from "../../shared/lib/context-menu/templates/ContextMenuOptions"
import EntityHierarchyService from "../services/engine/EntityHierarchyService"
import EngineStateService from "../services/engine/EngineStateService"
import LocalizationEN from "../../../contants/LocalizationEN";


export default function getViewportHotkeys(settings): { [key: string]: ContextMenuOption } {

	return {
		DUPLICATE: {
			label: "Duplicate active",
			callback: () => {
				const t = SelectionStore.mainEntity
				if (!t)
					return
				const entity = QueryAPI.getEntityByID(t)
				if (entity)
					EngineStateService.add(entity.clone())
			},
			require: settings.viewportHotkeys.DUPLICATE,
		},

		FOCUS_ON_CAMERA: {
			label: LocalizationEN.FOCUS_ON_CAMERA,
			callback: focusOnCamera,
			require: settings.viewportHotkeys.FOCUS_ON_CAMERA,
		},
		SHOW_SELECTED: {
			label: LocalizationEN.SHOW_SELECTED,
			callback: EntityHierarchyService.openTree,
			require: settings.viewportHotkeys.SHOW_SELECTED,
		},

		SAVE: {
			label: "Save",
			require: settings.viewportHotkeys.SAVE,
			callback: LevelService.save
		},
		INVERT_SELECTION: {
			label: "Invert selection",
			require: settings.viewportHotkeys.INVERT_SELECTION,
			callback: () => ViewportActionService.invertSelection()
		},
		SELECT_ALL: {
			label: "Select all",
			require: settings.viewportHotkeys.SELECT_ALL,
			callback: () => ViewportActionService.selectAll()
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
					EntityFactoryService.toggleEntityVisibility(selected[i], true)
				EntityHierarchyService.updateHierarchy()
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
			callback: snap,
			require: settings.viewportHotkeys.SNAP_TO_GRID,
		},
		FOCUS: {
			label: "Focus on active",
			require: settings.viewportHotkeys.FOCUS,
			callback: ViewportActionService.focus
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
			callback: EditorActionHistory.undo
		},
		REDO: {
			require: settings.viewportHotkeys.REDO,
			callback: EditorActionHistory.redo
		},
		GROUP: {
			label: "Group selected",
			require: settings.viewportHotkeys.GROUP,
			callback: ViewportActionService.group
		},
		FIXATE_ACTIVE: {
			label: "Fixate active",
			require: settings.viewportHotkeys.FIXATE_ACTIVE,
			callback: ViewportActionService.fixateActive
		},

		COPY: {
			label: "Copy",
			require: settings.viewportHotkeys.COPY,
			callback: ViewportActionService.copy
		},

		DELETE: {
			label: "Delete",
			require: settings.viewportHotkeys.DELETE,
			callback: ViewportActionService.deleteSelected
		},
		PASTE: {

			label: "Paste",
			require: settings.viewportHotkeys.PASTE,
			callback: ViewportActionService.paste
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