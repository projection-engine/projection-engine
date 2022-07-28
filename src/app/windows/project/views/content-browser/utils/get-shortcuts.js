import selection from "./selection";
import SELECTION_TYPES from "../templates/SELECTION_TYPES";
import FileSystem from "../../../libs/FileSystem";
import handleDelete from "./handle-delete";
import KEYS from "../../../libs/engine/data/KEYS";

export default function getShortcuts(){
    return  [
        {
            label: translate("SELECT_ALL"),
            require: [KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.ALL, hook, setSelected, selected)
        },
        {
            label: translate("SELECT_NONE"),
            require: [KEYS.AltLeft, KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.NONE, hook, setSelected, selected)
        },
        {
            label: translate("SELECT_INVERT"),

            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: () => selection(SELECTION_TYPES.INVERT, hook, setSelected, selected)
        },

        {
            label: translate("BACK"),
            require: [KEYS.Backspace],
            callback: () => {
                if(hook.currentDirectory.id !== FileSystem.sep) {
                    const found = hook.currentDirectory.id
                    if (found) {
                        const split = found.split(FileSystem.sep)
                        split.pop()
                        if (split.length === 1)
                            hook.setCurrentDirectory({id: FileSystem.sep})
                        else
                            hook.setCurrentDirectory({id: split.join(FileSystem.sep)})
                    }
                }
            }
        },

        {
            label: translate("DELETE"),
            require: [KEYS.Delete],
            disabled: selected.length === 0,
            callback: () => {
                const s = [...selected]
                setSelected([])
                handleDelete(s, hook)
            }
        },
        {
            label: translate("CUT"),
            require: [KEYS.ControlLeft, KEYS.KeyX],
            callback: () => {
                hook.setToCut(selected)
            }
        },
        {
            label: translate("PASTE"),
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: () => hook.paste()
        }
    ]
}