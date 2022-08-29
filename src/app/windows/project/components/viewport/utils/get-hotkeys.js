import KEYS from "../../../libs/engine/production/data/KEYS";
import ViewportActions from "../../../libs/ViewportActions";
import RendererStoreController from "../../../stores/RendererStoreController";
import GIZMOS from "../../../data/misc/GIZMOS";

export default function getHotkeys() {
    return [
        {
            require: [KEYS.ControlLeft, KEYS.KeyS],
            callback: RendererStoreController.save
        },
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
                const settings = RendererStoreController.settings
                RendererStoreController.updateSettings({...settings, gizmo: GIZMOS.TRANSLATION})
            }
        },
        {
            require: [KEYS.Home],
            callback: () => ViewportActions.focus(RendererStoreController.engine.selectedEntity)
        },
        {
            require: [KEYS.KeyS],
            callback: () => {
                const settings = RendererStoreController.settings
                RendererStoreController.updateSettings({...settings, gizmo: GIZMOS.SCALE})
            }
        },
        {
            require: [KEYS.KeyR],
            callback: () => {
                const settings = RendererStoreController.settings
                RendererStoreController.updateSettings({...settings, gizmo: GIZMOS.ROTATION})
            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyZ],
            callback: () => RendererStoreController.undo()
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyY],
            callback: () => RendererStoreController.redo()
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