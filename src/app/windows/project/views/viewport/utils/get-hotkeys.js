import KEYS from "../../../libs/engine/data/KEYS";
import ViewportActions from "../../../libs/ViewportActions";
import DataStoreController from "../../../stores/DataStoreController";
import GIZMOS from "../../../data/misc/GIZMOS";

export default function getHotkeys() {
    return [
        {
            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: ViewportActions.invertSelection
        },
        {
            require: [KEYS.KeyA],
            callback: () =>  ViewportActions.selectAll()
        },
        {
            require: [KEYS.KeyG],
            callback: () => {
                const settings = DataStoreController.settings
                DataStoreController.updateSettings({...settings, gizmo: GIZMOS.TRANSLATION})
            }
        },
        {
            require: [KEYS.Home],
            callback: () => ViewportActions.focus(DataStoreController.engine.selectedEntity)
        },
        {
            require: [KEYS.KeyS],
            callback: () => {
                const settings = DataStoreController.settings
                DataStoreController.updateSettings({...settings, gizmo: GIZMOS.SCALE})
            }
        },
        {
            require: [KEYS.KeyR],
            callback: () => {
                const settings = DataStoreController.settings
                DataStoreController.updateSettings({...settings, gizmo: GIZMOS.ROTATION})
            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyZ],
            callback: () => DataStoreController.undo()
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyY],
            callback: () => DataStoreController.redo()
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyP],
            callback: ViewportActions.group
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyF],
            callback: ViewportActions.fixateActive
        },

        {
            require: [KEYS.ControlLeft, KEYS.KeyC],
            callback: ViewportActions.copy
        },

        {
            require: [KEYS.Delete],
            callback: ViewportActions.deleteSelected
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: ViewportActions.paste
        }
    ]
}