import NodeFS from "../../../../../data/NodeFS"
import FilesAPI from "../../../../../data/files/FilesAPI"
import FileStoreController from "../../../stores/FileStoreController";
import RegistryAPI from "../../../../../data/files/RegistryAPI";
import ContentBrowserAPI from "../../../../../data/files/ContentBrowserAPI";

const pathResolve = window.require("path")
export default async function handleDropFolder(event, target, currentDirectory, setCurrentDirectory) {
    let items = []
    if (Array.isArray(event))
        items = event
    else
        try {
            items = JSON.parse(event)
        } catch (e) {
            alert.pushAlert("Error moving file", "error")
        }

    for (let i = 0; i < items.length; i++) {
        const textData = items[i]
        if (target !== FilesAPI.sep) {
            let from = textData
            if (!from.includes(FilesAPI.sep)) {

                const reg = await RegistryAPI.readRegistryFile(from)

                if (reg) from = reg.path
                else {
                    alert.pushAlert("Could not find file.", "error")
                    return
                }

            }
            const to = target + FilesAPI.sep + from.split(FilesAPI.sep).pop()

            const toItem = items.find(f => f.id === target)
            const fromItem = items.find(f => {
                return f.id === from || (f.registryID === textData && f.registryID !== undefined)
            })
            if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                ContentBrowserAPI.rename(pathResolve.resolve(FileStoreController.ASSETS_PATH + FilesAPI.sep + from), pathResolve.resolve(FileStoreController.ASSETS_PATH + to))
                    .then(() => {
                        if (from === currentDirectory.id) setCurrentDirectory({id: to})

                        FileStoreController.refreshFiles().catch()
                    })
            }
        } else if (textData.includes(FilesAPI.sep)) {
            const newPath = FileStoreController.ASSETS_PATH + FilesAPI.sep + textData.split(FilesAPI.sep).pop()
            if (!(await NodeFS.exists(newPath))) ContentBrowserAPI
                .rename(pathResolve.resolve(FileStoreController.ASSETS_PATH + FilesAPI.sep + textData), pathResolve.resolve(newPath))
                .then(() => {
                    if (textData === currentDirectory.id) setCurrentDirectory({id: newPath.replace(FileStoreController.ASSETS_PATH, "")})
                    FileStoreController.refreshFiles().catch()
                })
            else alert.pushAlert(
                "Folder already exists.", "error"
            )
        }

    }
}