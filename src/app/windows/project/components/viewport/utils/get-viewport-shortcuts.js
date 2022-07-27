import KEYS from "../../../libs/engine/data/KEYS";
import ViewportActions from "../libs/ViewportActions";
import StoreController from "../../../stores/StoreController";
import GIZMOS from "../../../static/misc/GIZMOS";

export default function getViewportShortcuts() {
    return [
        {
            label: "Invert selection",
            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: ViewportActions.invertSelection
        },
        {
            label: "Select all",
            require: [KEYS.KeyA],
            callback: () =>  {
                StoreController.updateEngine({...StoreController.engine, selected: window.renderer.entities.filter(e => !e.isFolder).map(e => e.id)})
            }
        },
        {
            label: "Select",
            require: [KEYS.Mouse0]
        },
        {
            label: "Select Multiple",
            require: [KEYS.ControlLeft, KEYS.Mouse0]
        },
        {label: "Save", require: [KEYS.ControlLeft, KEYS.KeyS], callback: () => serializer()},
        {
            label: "Translate",
            require: [KEYS.KeyG],
            callback: () => {
                const settings = StoreController.settings
                StoreController.updateSettings({...settings, gizmo: GIZMOS.TRANSLATION})
            }
        },
        {
            label: "Scale",
            require: [KEYS.KeyS],
            callback: () => {
                const settings = StoreController.settings
                StoreController.updateSettings({...settings, gizmo: GIZMOS.SCALE})
            }
        },
        {
            label: "Rotate",
            require: [KEYS.KeyR],
            callback: () => {
                const settings = StoreController.settings
                StoreController.updateSettings({...settings, gizmo: GIZMOS.ROTATION})
            }
        },
        // {
        //     label: "Undo",
        //     require: [KEYS.ControlLeft, KEYS.KeyZ],
        //     callback: () => engine.returnChanges()
        // },
        // {
        //     label: "Redo",
        //     require: [KEYS.ControlLeft, KEYS.KeyY],
        //     callback: () => engine.forwardChanges()
        // },
        {
            label: "Group",
            require: [KEYS.ControlLeft, KEYS.KeyP],
            callback: ViewportActions.group
        },
        {
            label: "Fixate active",
            require: [KEYS.ControlLeft, KEYS.KeyF],
            callback: ViewportActions.fixateActive
        },

        {
            label: "Copy",
            require: [KEYS.ControlLeft, KEYS.KeyC],
            callback: ViewportActions.copy
        },

        {
            label: "Delete",

            require: [KEYS.Delete],
            callback: ViewportActions.deleteSelected
        },
        {
            label: "Paste",
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: ViewportActions.paste
        },
        {
            label: "Rotate camera",
            require: [KEYS.Mouse1]
        }
    ]
}