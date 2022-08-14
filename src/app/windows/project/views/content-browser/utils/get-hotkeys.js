import selection from "./selection";
import SELECTION_TYPES from "../templates/SELECTION_TYPES";
import FilesAPI from "../../../../../libs/files/FilesAPI";
import handleDelete from "./handle-delete";
import KEYS from "../../../libs/engine/data/KEYS";
import CBStoreController from "../../../stores/CBStoreController";

export default function getHotkeys(translate, currentDirectory, setCurrentDirectory, setSelected, selected){
    return  [
        {
            label: translate("SELECT_ALL"),
            require: [KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.ALL,  currentDirectory, setSelected, selected)
        },
        {
            label: translate("SELECT_NONE"),
            require: [KEYS.AltLeft, KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.NONE,  currentDirectory, setSelected, selected)
        },
        {
            label: translate("SELECT_INVERT"),

            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: () => selection(SELECTION_TYPES.INVERT,  currentDirectory, setSelected, selected)
        },

        {
            label: translate("BACK"),
            require: [KEYS.Backspace],
            callback: () => {
                if(currentDirectory.id !== FilesAPI.sep) {
                    const found = currentDirectory.id
                    if (found) {
                        const split = found.split(FilesAPI.sep)
                        split.pop()
                        if (split.length === 1)
                            setCurrentDirectory({id: FilesAPI.sep})
                        else
                            setCurrentDirectory({id: split.join(FilesAPI.sep)})
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
                handleDelete(s, currentDirectory, setCurrentDirectory)
            }
        },
        {
            label: translate("CUT"),
            require: [KEYS.ControlLeft, KEYS.KeyX],
            callback: () => {
                CBStoreController.toCut = selected
            }
        },
        {
            label: translate("PASTE"),
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: () => CBStoreController.paste(currentDirectory.id, setCurrentDirectory)
        }
    ]
}