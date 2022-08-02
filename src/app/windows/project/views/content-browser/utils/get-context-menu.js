import createNewFolder from "./create-new-folder"
import handleDelete from "./handle-delete"
import AsyncFS from "../../../libs/AsyncFS"

import FileSystem from "../../../libs/FileSystem"
import SYSTEM_TEMPLATE from "../templates/SYSTEM_TEMPLATE"
import FileStoreController from "../../../stores/FileStoreController";
import FILE_TYPES from "../../../../../../static/FILE_TYPES";
import COMPONENT_TEMPLATE from "../templates/COMPONENT_TEMPLATE";


const {shell} = window.require("electron")
export default function getContextMenu(currentDirectory, setCurrentDirectory, navigationHistory, setCurrentItem, translate) {
    const check = async (path, ext) => {
        let n = path + ext
        let it = 0

        while (await window.fileSystem.assetExists(n)) {
            it++
            n = path + `(${it})` + ext
        }

        return n
    }
    return [
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
            onClick: (node) => createNewFolder(node.getAttribute("data-folder")).catch()
        },

        {
            requiredTrigger: "data-folder",
            label: translate("OPEN_WITH_EXPLORER"),
            onClick: (node) => {
                shell.showItemInFolder(FileStoreController.ASSETS_PATH + FileSystem.sep + node.getAttribute("data-folder") + FileSystem.sep)
            }
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: translate("CUT"),
            onClick: (node) => FileStoreController.toCut = [node.getAttribute("data-folder")]
        },
        {
            requiredTrigger: "data-folder",
            label: translate("PASTE"),
            onClick: (node) => FileStoreController.paste(node.getAttribute("data-folder"), setCurrentDirectory)
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
            onClick: (node) => FileStoreController.toCut = [node.getAttribute("data-file")]
        },
        {
            requiredTrigger: "data-file",
            label: translate("PASTE"),
            onClick: (node) => FileStoreController.paste(node.getAttribute("data-file"), setCurrentDirectory)
        },

        // WRAPPER
        {
            requiredTrigger: "data-wrapper",
            label: translate("PASTE"),
            onClick: () => FileStoreController.paste(currentDirectory, setCurrentDirectory)
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("BACK"),
            onClick: () => navigationHistory.returnDir()
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("FORWARD"),
            onClick: () => navigationHistory.forwardDir()
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("REFRESH"),
            icon: "refresh",
            onClick: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                FileStoreController.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("GO_TO_PARENT"),

            onClick: () => {
                if (currentDirectory.id !== FileSystem.sep)
                    navigationHistory.goToParent()
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: async () => {
                let path = currentDirectory.id + FileSystem.sep + "New folder"
                const existing = await window.fileSystem.foldersFromDirectory(FileStoreController.ASSETS_PATH + currentDirectory.id)
                if (existing.length > 0)
                    path += " - " + existing.length

                const [e] = await AsyncFS.mkdir(FileStoreController.ASSETS_PATH + path, {})
                if (!e)
                    FileStoreController.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("OPEN_WITH_EXPLORER"),
            icon: "open_in_new",
            onClick: () => {
                shell.showItemInFolder(FileStoreController.ASSETS_PATH+ FileSystem.sep + currentDirectory.id)
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_MATERIAL"),
            icon: "texture",
            onClick: async () => {
                let path = await check(currentDirectory.id + FileSystem.sep + translate("NEW_MATERIAL"), ".material")
                window.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        FileStoreController.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_MATERIAL_INSTANCE"),
            icon: "texture",
            onClick: async () => null
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_SYSTEM"),
            icon: "memory",
            onClick: async () => {
                let path = await check(currentDirectory.id + FileSystem.sep + translate("NEW_SYSTEM"), FILE_TYPES.SYSTEM)

                await window.fileSystem.writeAsset(path, SYSTEM_TEMPLATE)
                FileStoreController.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_COMPONENT"),
            icon: "extension",
            onClick: async () => {
                let path = await check(currentDirectory.id + FileSystem.sep + translate("NEW_COMPONENT"), FILE_TYPES.COMPONENT)

                await window.fileSystem.writeAsset(path, COMPONENT_TEMPLATE)
                FileStoreController.refreshFiles().catch()
            }
        },
    ]
}