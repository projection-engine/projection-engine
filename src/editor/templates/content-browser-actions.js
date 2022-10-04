import selection from "../views/content-browser/utils/selection";
import SELECTION_TYPES from "../views/content-browser/templates/SELECTION_TYPES";
import FilesAPI from "../../shared/libs/FilesAPI";
import handleDelete from "../views/content-browser/utils/handle-delete";
import FilesStore from "../stores/FilesStore";
import SelectionStore from "../stores/SelectionStore";
import importFile from "../libs/import-file";
import getMaterialAsOption from "./utils/get-material-as-option";
import Localization from "../../shared/libs/Localization";
import getCreationOptions from "../views/content-browser/utils/get-creation-options";

const {shell} = window.require("electron")
const translate = key => Localization.PROJECT.FILES[key]
export default function contentBrowserActions(settings, navigationHistory, currentDirectory, setCurrentDirectory, setCurrentItem, materials) {

    const hotKeys = {
        BACK: {
            label: "Go back",
            require: settings.contentBrowserHotkeys.BACK,
            callback: () => navigationHistory.undo()
        },
        FORWARD: {
            label: "Go forward",
            require: settings.contentBrowserHotkeys.FORWARD,
            callback: () => navigationHistory.redo()
        },

        SELECT_ALL: {
            label: "Select all",
            require: settings.contentBrowserHotkeys.SELECT_ALL,
            callback: () => selection(SELECTION_TYPES.ALL, currentDirectory)
        },
        SELECT_NONE: {
            label: "Select none",
            require: settings.contentBrowserHotkeys.SELECT_NONE,
            callback: () => selection(SELECTION_TYPES.NONE, currentDirectory)
        },
        INVERT_SELECTION: {
            label: "Invert selection",

            require: settings.contentBrowserHotkeys.INVERT_SELECTION,
            callback: () => selection(SELECTION_TYPES.INVERT, currentDirectory)
        },
        REFRESH: {
            label: "Refresh",
            require: settings.contentBrowserHotkeys.REFRESH,
            callback: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                FilesStore.refreshFiles().catch()
            }
        },
        GO_TO_PARENT: {
            label: "Go to parent",
            require: settings.contentBrowserHotkeys.GO_TO_PARENT,
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
        RENAME: {
            label: "Rename",
            require: settings.contentBrowserHotkeys.RENAME,
            callback: () => {
                setCurrentItem(SelectionStore.contentBrowserSelected[0])
            },
        },
        DELETE: {
            label: translate("DELETE"),
            require: settings.contentBrowserHotkeys.DELETE,
            callback: () => {
                const s = [...SelectionStore.contentBrowserSelected]
                SelectionStore.contentBrowserSelected = []
                handleDelete(s, currentDirectory, setCurrentDirectory)
            }
        },
        CUT: {
            label: translate("CUT"),
            require: settings.contentBrowserHotkeys.CUT,
            callback: () => FilesStore.updateStore({...FilesStore.data, toCut: [...SelectionStore.contentBrowserSelected]})
        },
        PASTE: {
            label: translate("PASTE"),
            require: settings.contentBrowserHotkeys.PASTE,
            callback: () => FilesStore.paste(currentDirectory.id, setCurrentDirectory)
        }
    }

    return {
        hotKeys: Object.values(hotKeys),
        contextMenu: [
            hotKeys.BACK,
            hotKeys.FORWARD,
            {divider: true},
            {
                label: translate("IMPORT"),
                onClick: () => importFile(currentDirectory)
            },
            hotKeys.REFRESH,
            {divider: true},
            hotKeys.RENAME,
            hotKeys.CUT,
            hotKeys.PASTE,
            hotKeys.DELETE,
            {divider: true},
            {
                label: "Open current directory on explorer",
                icon: "open_in_new",
                onClick: () => shell.showItemInFolder(FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + currentDirectory.id))
            },
            {divider: true},

            {
                label: "Create",
                icon: "add",
                children: getCreationOptions(currentDirectory)
            },
            {
                label: "Create material instance",
                children: materials.map(m => getMaterialAsOption(m, currentDirectory))
            }
        ]
    }
}