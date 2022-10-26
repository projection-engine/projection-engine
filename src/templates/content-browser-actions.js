import selection from "../views/content-browser/utils/selection";
import SELECTION_TYPES from "../views/content-browser/templates/SELECTION_TYPES";
import handleDelete from "../views/content-browser/utils/handle-delete";
import FilesStore from "../stores/FilesStore";
import SelectionStore from "../stores/SelectionStore";
import importFile from "../utils/import-file";
import Localization from "./Localization";
import getCreationOptions from "../views/content-browser/utils/get-creation-options";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

const {shell} = window.require("electron")
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
                alert.pushAlert(Localization.REFRESHING, "info")
                FilesStore.refreshFiles().catch()
            }
        },
        GO_TO_PARENT: {
            label: "Go to parent",
            require: settings.contentBrowserHotkeys.GO_TO_PARENT,
            callback: () => {
                if (currentDirectory.id !== NodeFS.sep) {
                    const found = currentDirectory.id
                    if (found) {
                        const split = found.split(NodeFS.sep)
                        split.pop()
                        if (split.length === 1)
                            setCurrentDirectory({id: NodeFS.sep})
                        else
                            setCurrentDirectory({id: split.join(NodeFS.sep)})
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
            label: Localization.DELETE,
            require: settings.contentBrowserHotkeys.DELETE,
            callback: () => {
                const s = [...SelectionStore.contentBrowserSelected]
                if (s.length > 0) {
                    SelectionStore.contentBrowserSelected = []
                    handleDelete(s, currentDirectory, setCurrentDirectory)
                }
            }
        },
        CUT: {
            label: Localization.CUT,
            require: settings.contentBrowserHotkeys.CUT,
            callback: () => FilesStore.updateStore({
                ...FilesStore.data,
                toCut: [...SelectionStore.contentBrowserSelected]
            })
        },
        PASTE: {
            label: Localization.PASTE,
            require: settings.contentBrowserHotkeys.PASTE,
            callback: () => FilesStore.paste(currentDirectory.id, setCurrentDirectory)
        }
    }

    return {
        hotKeys: Object.values(hotKeys),
        contextMenu: [
            hotKeys.SELECT_ALL,
            hotKeys.SELECT_NONE,
            hotKeys.INVERT_SELECTION,
            {divider: true},
            hotKeys.BACK,
            hotKeys.FORWARD,
            {divider: true},
            {
                label: Localization.IMPORT,
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
                onClick: () => shell.showItemInFolder(NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + currentDirectory.id))
            },
            {divider: true},

            {
                label: "Create",
                icon: "add",
                children: getCreationOptions(currentDirectory, materials)
            }
        ]
    }
}