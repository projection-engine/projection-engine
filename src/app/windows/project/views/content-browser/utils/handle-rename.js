import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"
import FileStoreController from "../../../stores/FileStoreController";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FileSystem.sep + newName : FileSystem.sep + newName)
            await window.fileSystem
                .rename(FileStoreController.ASSETS_PATH + item.id, FileStoreController.ASSETS_PATH + newNamePath)

            if (item.id === currentDirectory.id)
                setCurrentDirectory(prev => {
                    return {
                        ...prev,
                        id: newNamePath
                    }
                })
            FileStoreController.refreshFiles().catch()
            FileStoreController.renameBookmark(item.id, newNamePath)
        } else {
            const nameToApply = newName + "." + item.type
            if (newName !== item.name) {
                const targetPath = FileStoreController.ASSETS_PATH + (item.parent ? item.parent + FileSystem.sep : FileSystem.sep) + nameToApply

                if (!(await AsyncFS.exists(targetPath))) {
                    await window
                        .fileSystem
                        .rename(FileStoreController.ASSETS_PATH + item.id, targetPath)
                    FileStoreController.refreshFiles().catch()
                } else
                    alert.pushAlert(
                        "Item already exists.",
                        "error"
                    )
            }
            setCurrentItem()
        }
    }
    else
        setCurrentItem()
}