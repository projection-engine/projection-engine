import createNewFolder from "./createNewFolder"
import handleDelete from "./handleDelete"
import AsyncFS from "../../../libs/AsyncFS"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import FileSystem from "../../../libs/FileSystem"
import SCRIPT_TEMPLATE from "../../../static/misc/SCRIPT_TEMPLATE"


const {shell} = window.require("electron")
export default function getFileOptions(hook, setCurrentItem, translate) {
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
            onClick: (node) => handleDelete(node.getAttribute("data-folder"), hook)
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: (node) => createNewFolder(node.getAttribute("data-folder"), hook).catch()
        },

        {
            requiredTrigger: "data-folder",
            label: translate("OPEN_WITH_EXPLORER"),
            onClick: (node) => {
                shell.showItemInFolder(hook.path + FileSystem.sep + node.getAttribute("data-folder") + FileSystem.sep)
            }
        },
        {divider: true, requiredTrigger: "data-folder"},
        {
            requiredTrigger: "data-folder",
            label: translate("CUT"),
            onClick: (node) => hook.setToCut([node.getAttribute("data-folder")])
        },
        {
            requiredTrigger: "data-folder",
            label: translate("PASTE"),
            onClick: (node) => hook.paste(node.getAttribute("data-folder"))
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
            onClick: (node) => handleDelete(node.getAttribute("data-file"), hook)

        },
        {divider: true, requiredTrigger: "data-file"},
        {
            requiredTrigger: "data-file",
            label: translate("CUT"),
            onClick: (node) => hook.setToCut([node.getAttribute("data-file")])
        },
        {
            requiredTrigger: "data-file",
            label: translate("PASTE"),
            onClick: (node) => hook.paste(node.getAttribute("data-file"))
        },

        // WRAPPER
        {
            requiredTrigger: "data-wrapper",
            label: translate("PASTE"),
            onClick: () => hook.paste()
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("BACK"),
            onClick: () => hook.returnDir()
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("FORWARD"),
            onClick: () => hook.forwardDir()
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("REFRESH"),
            icon: "refresh",
            onClick: () => {
                alert.pushAlert(translate("REFRESHING"), "info")
                hook.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("GO_TO_PARENT"),

            onClick: () => {
                if (hook.currentDirectory.id !== FileSystem.sep)
                    hook.goToParent()
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_FOLDER"),
            icon: "create_new_folder",
            onClick: async () => {
                let path = hook.currentDirectory.id + FileSystem.sep + "New folder"
                const existing = await window.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                if (existing.length > 0)
                    path += " - " + existing.length

                const [e] = await AsyncFS.mkdir(hook.path + path, {})
                if (!e)
                    hook.refreshFiles().catch()
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("OPEN_WITH_EXPLORER"),
            icon: "open_in_new",
            onClick: () => {
                shell.showItemInFolder(hook.path + FileSystem.sep + hook.currentDirectory.id)
            }
        },
        {divider: true, requiredTrigger: "data-wrapper"},
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_MATERIAL"),
            icon: "texture",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + translate("NEW_MATERIAL"), ".material")
                window.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: "data-wrapper",
            label: translate("NEW_SCRIPT"),
            icon: "code",
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + FileSystem.sep + translate("NEW_SCRIPT"), FILE_TYPES.SCRIPT)

                await window.fileSystem.writeAsset(path, SCRIPT_TEMPLATE)
                hook.refreshFiles().catch()
            }
        },
    ]
}