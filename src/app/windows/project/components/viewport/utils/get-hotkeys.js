import KEYS from "../../../../../../../public/engine/production/data/KEYS";
import ViewportActions from "../../../libs/ViewportActions";
import EngineStore from "../../../stores/EngineStore";
import GIZMOS from "../../../data/GIZMOS";
import SettingsStore from "../../../stores/SettingsStore";
import ActionHistoryAPI from "../../../stores/ActionHistoryAPI";
import SelectionStore from "../../../stores/SelectionStore";

export default function getHotkeys() {
    return [
        {
            require: [KEYS.ControlLeft, KEYS.KeyS],
            callback: EngineStore.save
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
                const settings = SettingsStore.data
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.TRANSLATION})
            }
        },
        {
            require: [KEYS.Home],
            callback: () => ViewportActions.focus(EngineStore.engine.entities.get(SelectionStore.engineSelected[0] != null? SelectionStore.engineSelected[0]: SelectionStore.lockedEntity))
        },
        {
            require: [KEYS.KeyS],
            callback: () => {
                const settings = SettingsStore.data
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.SCALE})
            }
        },
        {
            require: [KEYS.KeyR],
            callback: () => {
                const settings = SettingsStore.data
                SettingsStore.updateStore({...settings, gizmo: GIZMOS.ROTATION})
            }
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyZ],
            callback: () => ActionHistoryAPI.undo()
        },
        {
            require: [KEYS.ControlLeft, KEYS.KeyY],
            callback: () => ActionHistoryAPI.redo()
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