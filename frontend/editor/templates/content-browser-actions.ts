import selection from "../views/content-browser/utils/selection";
import SELECTION_TYPES from "../views/content-browser/templates/SELECTION_TYPES";
import handleDelete from "../views/content-browser/utils/handle-delete";
import FilesStore from "../stores/FilesStore";
import SelectionStore from "../stores/SelectionStore";
import importFile from "../utils/import-file";
import LOCALIZATION_EN from "../static/LOCALIZATION_EN";
import getCreationOptions from "../views/content-browser/utils/get-creation-options";
import RegistryAPI from "../lib/fs/RegistryAPI";
import FS from "../../lib/FS/FS";
import AlertController from "../../components/alert/AlertController";

const {shell, clipboard} = window.require("electron")
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
                AlertController.success(LOCALIZATION_EN.REFRESHING)
                FilesStore.refreshFiles().catch()
            }
        },
        GO_TO_PARENT: {
            label: "Go to parent",
            require: settings.contentBrowserHotkeys.GO_TO_PARENT,
            callback: () => {
                if (currentDirectory.id !== FS.sep) {
                    const found = currentDirectory.id
                    if (found) {
                        const split = found.split(FS.sep)
                        split.pop()
                        if (split.length === 1)
                            setCurrentDirectory({id: FS.sep})
                        else
                            setCurrentDirectory({id: split.join(FS.sep)})
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
            label: LOCALIZATION_EN.DELETE,
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
            label: LOCALIZATION_EN.CUT,
            require: settings.contentBrowserHotkeys.CUT,
            callback: () => FilesStore.updateStore({
                ...FilesStore.data,
                toCut: [...SelectionStore.contentBrowserSelected]
            })
        },
        PASTE: {
            label: LOCALIZATION_EN.PASTE,
            require: settings.contentBrowserHotkeys.PASTE,
            callback: () => FilesStore.paste(currentDirectory.id)
        }
    }

    return {
        hotKeys: Object.values(hotKeys),
        contextMenu: [
            {
                label: LOCALIZATION_EN.COPY_ID,
                onClick: () => {
                    const ID = RegistryAPI.getByPath(SelectionStore.contentBrowserSelected[0])
                    if(ID){
                        AlertController.success(LOCALIZATION_EN.COPIED)
                        clipboard.writeText(ID)
                    }
                }
            },
            {divider: true},
            hotKeys.SELECT_ALL,
            hotKeys.SELECT_NONE,
            hotKeys.INVERT_SELECTION,
            {divider: true},
            hotKeys.BACK,
            hotKeys.FORWARD,
            {divider: true},
            {
                label: LOCALIZATION_EN.IMPORT,
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
                onClick: () => shell.showItemInFolder(FS.resolvePath(FS.ASSETS_PATH + FS.sep + currentDirectory.id))
            },
            {divider: true},

            {
                label: "Create",
                icon: "add",
                children: getCreationOptions(currentDirectory)
            }
        ]
    }
}