import selection from "../views/content-browser/utils/selection";
import SELECTION_TYPES from "../views/content-browser/templates/SELECTION_TYPES";
import FilesAPI from "../../shared/libs/files/FilesAPI";
import handleDelete from "../views/content-browser/utils/handle-delete";
import KEYS from "../../../public/engine/static/KEYS";
import FilesStore from "../stores/FilesStore";
import SelectionStore from "../stores/SelectionStore";
import importFile from "../libs/import-file";
import getMaterialAsOption from "./utils/get-material-as-option";
import resolveFileName from "./utils/resolve-file-name";
import FILE_TYPES from "../../static/FILE_TYPES";
import AssetAPI from "../../shared/libs/files/AssetAPI";
import SIMPLE_MATERIAL_TEMPLATE from "../../../public/engine/production/materials/simple/SIMPLE_MATERIAL_UNIFORMS";
import COMPONENT_TEMPLATE from "../../../public/engine/static/templates/COMPONENT_TEMPLATE";
import UI_TEMPLATE from "../../../public/engine/static/templates/UI_TEMPLATE";
import Localization from "../../shared/libs/Localization";
import TERRAIN_TEMPLATE from "../../../public/engine/static/templates/TERRAIN_TEMPLATE";
import TERRAIN_LAYERED from "../../../public/engine/production/materials/terrain-layered/TERRAIN_MATERIAL";
import TERRAIN_MATERIAL_UNIFORMS from "../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";

const {shell} = window.require("electron")
const translate = key => Localization.PROJECT.FILES[key]
export default function contentBrowserActions(navigationHistory, currentDirectory, setCurrentDirectory, setCurrentItem, materials) {

    const hotKeys = {
        BACK: {
            label: "Go back",
            require: [KEYS.AltLeft, KEYS.ArrowLeft],
            callback: () => navigationHistory.undo()
        },
        FORWARD: {
            label: "Go forward",
            require: [KEYS.AltLeft, KEYS.ArrowRight],
            callback: () => navigationHistory.redo()
        },

        SELECT_ALL: {
            label: "Select all",
            require: [KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.ALL, currentDirectory)
        },
        SELECT_NONE: {
            label: "Select none",
            require: [KEYS.AltLeft, KEYS.KeyA],
            callback: () => selection(SELECTION_TYPES.NONE, currentDirectory)
        },
        INVERT_SELECTION: {
            label: "Invert selection",

            require: [KEYS.ControlLeft, KEYS.KeyI],
            callback: () => selection(SELECTION_TYPES.INVERT, currentDirectory)
        },
        REFRESH: {
            label: "Refresh",
            require: [KEYS.F5],
            callback: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                FilesStore.refreshFiles().catch()
            }
        },
        GO_TO_PARENT: {
            label: "Go to parent",
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
        RENAME: {
            label: "Rename",
            require: [KEYS.F2],
            callback: () => {
                setCurrentItem(SelectionStore.contentBrowserSelected[0])
            },
        },
        DELETE: {
            label: translate("DELETE"),
            require: [KEYS.Delete],
            callback: () => {
                const s = [...SelectionStore.contentBrowserSelected]
                SelectionStore.contentBrowserSelected = []
                handleDelete(s, currentDirectory, setCurrentDirectory)
            }
        },
        CUT: {
            label: translate("CUT"),
            require: [KEYS.ControlLeft, KEYS.KeyX],
            callback: () => FilesStore.toCut = [...SelectionStore.contentBrowserSelected]
        },
        PASTE: {
            label: translate("PASTE"),
            require: [KEYS.ControlLeft, KEYS.KeyV],
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
                children: [
                    {
                        label: translate("NEW_FOLDER"),
                        icon: "create_new_folder",
                        onClick: () => FilesStore.createFolder(currentDirectory).catch()
                    },
                    {
                        label: translate("NEW_MATERIAL"),
                        icon: "texture",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_MATERIAL"), FILE_TYPES.MATERIAL)
                            AssetAPI.writeAsset(path, JSON.stringify({}))
                                .then(() => {
                                    FilesStore.refreshFiles()
                                })
                        }
                    },
                    {
                        label: translate("NEW_SIMPLE_MATERIAL"),
                        icon: "texture",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_SIMPLE_MATERIAL"), FILE_TYPES.SIMPLE_MATERIAL)
                            AssetAPI.writeAsset(path, JSON.stringify(SIMPLE_MATERIAL_TEMPLATE))
                                .then(() => {
                                    FilesStore.refreshFiles()
                                })
                        }
                    },
                    {
                        label: translate("NEW_TERRAIN_MATERIAL"),
                        icon: "texture",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_TERRAIN_MATERIAL"), FILE_TYPES.TERRAIN_MATERIAL)
                            AssetAPI.writeAsset(path, JSON.stringify({original: TERRAIN_LAYERED, uniformsData: TERRAIN_MATERIAL_UNIFORMS }))
                                .then(() => {
                                    FilesStore.refreshFiles()
                                })
                        }
                    },
                    {
                        label: translate("NEW_COMPONENT"),
                        icon: "extension",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_COMPONENT"), FILE_TYPES.COMPONENT)

                            await AssetAPI.writeAsset(path, COMPONENT_TEMPLATE)
                            FilesStore.refreshFiles().catch()
                        }
                    },
                    {
                        label: translate("NEW_LEVEL"),
                        icon: "forest",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_LEVEL"), FILE_TYPES.LEVEL)

                            await AssetAPI.writeAsset(path, JSON.stringify({
                                entities: []
                            }))
                            FilesStore.refreshFiles().catch()
                        }
                    },
                    {
                        label: translate("NEW_UI_LAYOUT"),
                        icon: "view_quilt",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_UI_LAYOUT"), FILE_TYPES.UI_LAYOUT)
                            await AssetAPI.writeAsset(path, UI_TEMPLATE)
                            FilesStore.refreshFiles().catch()

                        }
                    },
                    {
                        label: translate("NEW_TERRAIN"),
                        icon: "landscape",
                        onClick: async () => {
                            let path = await resolveFileName(currentDirectory.id + FilesAPI.sep + translate("NEW_TERRAIN"), FILE_TYPES.TERRAIN)
                            await AssetAPI.writeAsset(path, JSON.stringify(TERRAIN_TEMPLATE))
                            FilesStore.refreshFiles().catch()
                        }
                    },
                ]
            },
            {
                label: "Create material instance",
                children: materials.map(m => getMaterialAsOption(m, currentDirectory))
            }
        ]
    }
}