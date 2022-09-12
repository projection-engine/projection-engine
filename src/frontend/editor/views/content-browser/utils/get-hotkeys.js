import selection from "./selection";
import SELECTION_TYPES from "../templates/SELECTION_TYPES";
import FilesAPI from "../../../../shared/libs/files/FilesAPI";
import handleDelete from "./handle-delete";
import KEYS from "../../../../../../public/engine/static/KEYS";
import FilesStore from "../../../stores/FilesStore";
import SelectionStore from "../../../stores/SelectionStore";

export default function getHotkeys(translate, currentDirectory, setCurrentDirectory) {
    return [
        {
            label: translate("SELECT_ALL"),
            require: [KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.ALL, currentDirectory)
        },
        {
            label: translate("SELECT_NONE"),
            require: [KEYS.AltLeft, KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.NONE, currentDirectory)
        },
        {
            label: translate("SELECT_INVERT"),

            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: () => selection(SELECTION_TYPES.INVERT, currentDirectory)
        },
        {
            label: translate("BACK"),
            require: [KEYS.F5],
            callback: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                FilesStore.refreshFiles().catch()
            }
        },
        {
            label: translate("BACK"),
            require: [KEYS.Backspace],
            callback: () => {
                if (currentDirectory.id !== FilesAPI.sep) {
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
            callback: () => {
                const s = [...SelectionStore.contentBrowserSelected]
                SelectionStore.contentBrowserSelected = []
                handleDelete(s, currentDirectory, setCurrentDirectory)
            }
        },
        {
            label: translate("CUT"),
            require: [KEYS.ControlLeft, KEYS.KeyX],
            callback: () => FilesStore.toCut = SelectionStore.contentBrowserSelected
        },
        {
            label: translate("PASTE"),
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: () => FilesStore.paste(currentDirectory.id, setCurrentDirectory)
        }
    ]
}