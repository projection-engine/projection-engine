import handleDelete from "./handle-delete"
import FilesAPI from "../../../../shared/libs/files/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import FILE_TYPES from "../../../../../static/FILE_TYPES";
import COMPONENT_TEMPLATE from "../../../../../../public/engine/static/COMPONENT_TEMPLATE";
import importFile from "../../../libs/import-file";
import AssetAPI from "../../../../shared/libs/files/AssetAPI";
import UI_TEMPLATE from "../templates/UI_TEMPLATE";

const {shell} = window.require("electron")
export default function getContextMenu(selected, currentDirectory, setCurrentDirectory, navigationHistory, setCurrentItem, translate) {
    const check = async (path, ext) => {
        let n = path + ext
        let it = 0

        while (await AssetAPI.assetExists(n)) {
            n = path + `(${it})` + ext
            it++
        }
        return n
    }
    const multiSelectOptions = [
        {

            label: translate("DELETE"),
            icon: "delete",
            onClick: () => handleDelete([...selected], currentDirectory, setCurrentDirectory)

        },
        {divider: true},
        {

            label: translate("CUT"),
            onClick: () => FilesStore.toCut = [...selected]
        },
        {
            requiredTrigger: "data-folder",
            label: translate("PASTE"),
            onClick: (node) => FilesStore.paste(node.getAttribute("data-folder"), setCurrentDirectory)
        },
    ]
    if (selected.length > 1) {
        return multiSelectOptions.map(v => {
            if (!v.requiredTrigger)
                return [{...v, requiredTrigger: "data-file"}, {...v, requiredTrigger: "data-folder"}]

                return v
        }).flat()
    }
    return [
        {
            requiredTrigger: "data-wrapper",
            label: translate("IMPORT"),
            onClick: () => importFile(currentDirectory)
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-folder",
            label: translate("RENAME"),
            onClick: (node) => {
                setCurrentItem(node.getAttribute("data-folder"))
            }
        },
        {
            requiredTrigger: "data-folder",
            label: translate("DELETE"),
            icon: "delete",
            onClick: (node) => handleDelete(node.getAttribute("data-folder"), currentDirectory, setCurrentDirectory)
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: (node) => FilesStore.createFolder({id: node.getAttribute("data-folder")}).catch()
        },

        {
            requiredTrigger: "data-folder",
            label: translate("OPEN_WITH_EXPLORER"),
            onClick: (node) => {
                shell.showItemInFolder(FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + node.getAttribute("data-folder") + FilesAPI.sep))
            }
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: translate("CUT"),
            onClick: (node) => FilesStore.toCut = [node.getAttribute("data-folder")]
        },
        {
            requiredTrigger: "data-folder",
            label: translate("PASTE"),
            onClick: (node) => FilesStore.paste(node.getAttribute("data-folder"), setCurrentDirectory)
        },

        // FILE
        {
            requiredTrigger: "data-file",
            label: translate("RENAME"),
            icon: "edit",
            onClick: (node) => {
                setCurrentItem(node.getAttribute("data-file"))
            }
        },
        {
            requiredTrigger: "data-file",
            label: translate("DELETE"),
            icon: "delete",
            onClick: (node) => handleDelete(node.getAttribute("data-file"), currentDirectory, setCurrentDirectory)

        },
        {divider: true, requiredTrigger: "data-file"},
        {
            requiredTrigger: "data-file",
            label: translate("CUT"),
            onClick: (node) => FilesStore.toCut = [node.getAttribute("data-file")]
        },
        {
            requiredTrigger: "data-file",
            label: translate("PASTE"),
            onClick: (node) => FilesStore.paste(node.getAttribute("data-file"), setCurrentDirectory)
        },

        // WRAPPER
        {
            requiredTrigger: "data-wrapper",
            label: translate("PASTE"),
            onClick: () => FilesStore.paste(currentDirectory, setCurrentDirectory)
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("BACK"),
            onClick: () => navigationHistory.undo()
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("FORWARD"),
            onClick: () => navigationHistory.redo()
        },

        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("REFRESH"),
            icon: "refresh",
            onClick: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                FilesStore.refreshFiles().catch()
            }
        },

        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: () => FilesStore.createFolder(currentDirectory).catch()
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("OPEN_WITH_EXPLORER"),
            icon: "open_in_new",
            onClick: () => {
                shell.showItemInFolder(FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + currentDirectory.id))
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("CREATE"),
            children: [
                {
                    label: translate("NEW_MATERIAL"),
                    icon: "texture",
                    onClick: async () => {
                        let path = await check(currentDirectory.id + FilesAPI.sep + translate("NEW_MATERIAL"), ".material")
                        AssetAPI.writeAsset(path, JSON.stringify({}))
                            .then(() => {
                                FilesStore.refreshFiles()
                            })
                    }
                },

                {
                    label: translate("NEW_COMPONENT"),
                    icon: "extension",
                    onClick: async () => {
                        let path = await check(currentDirectory.id + FilesAPI.sep + translate("NEW_COMPONENT"), FILE_TYPES.COMPONENT)

                        await AssetAPI.writeAsset(path, COMPONENT_TEMPLATE)
                        FilesStore.refreshFiles().catch()
                    }
                },

                {
                    label: translate("NEW_LEVEL"),
                    icon: "play_circle_filled",
                    onClick: async () => {
                        let path = await check(currentDirectory.id + FilesAPI.sep + translate("NEW_LEVEL"), FILE_TYPES.LEVEL)

                        await AssetAPI.writeAsset(path, JSON.stringify({
                            entities: []
                        }))
                        FilesStore.refreshFiles().catch()
                    }
                },
                {
                    label: translate("NEW_STYLESHEET"),
                    icon: "css",
                    onClick: async () => {
                        let path = await check(currentDirectory.id + FilesAPI.sep + translate("NEW_STYLESHEET"), FILE_TYPES.STYLESHEET)

                        await AssetAPI.writeAsset(path, UI_TEMPLATE.CSS)
                        FilesStore.refreshFiles().catch()
                    }
                },
                {
                    label: translate("NEW_UI_LAYOUT"),
                    icon: "view_quilt",
                    onClick: async () => {
                        let path = await check(currentDirectory.id + FilesAPI.sep + translate("NEW_UI_LAYOUT"), FILE_TYPES.UI_LAYOUT)

                        await AssetAPI.writeAsset(path, UI_TEMPLATE.LAYOUT)
                        FilesStore.refreshFiles().catch()
                    }
                },
            ]
        },

    ]
}