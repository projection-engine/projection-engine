import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"
import FileStoreController from "../../../stores/FileStoreController";

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
        if (target !== FileSystem.sep) {
            let from = textData
            if (!from.includes(FileSystem.sep)) {

                const reg = await window.fileSystem.readRegistryFile(from)

                if (reg) from = reg.path
                else {
                    alert.pushAlert("Could not find file.", "error")
                    return
                }

            }
            const to = target + FileSystem.sep + from.split(FileSystem.sep).pop()

            const toItem = items.find(f => f.id === target)
            const fromItem = items.find(f => {
                return f.id === from || (f.registryID === textData && f.registryID !== undefined)
            })
            if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                window.fileSystem
                    .rename(pathResolve.resolve(FileStoreController.ASSETS_PATH + FileSystem.sep + from), pathResolve.resolve(FileStoreController.ASSETS_PATH + to))
                    .then(() => {
                        if (from === currentDirectory.id) setCurrentDirectory({id: to})

                        FileStoreController.refreshFiles().catch()
                    })
            }
        } else if (textData.includes(FileSystem.sep)) {
            const newPath = FileStoreController.ASSETS_PATH + FileSystem.sep + textData.split(FileSystem.sep).pop()
            if (!(await AsyncFS.exists(newPath))) window.fileSystem
                .rename(pathResolve.resolve(FileStoreController.ASSETS_PATH + FileSystem.sep + textData), pathResolve.resolve(newPath))
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