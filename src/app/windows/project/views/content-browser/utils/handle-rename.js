import NodeFS from "../../../../../libs/NodeFS"
import FilesAPI from "../../../../../libs/files/FilesAPI"
import FileStoreController from "../../../stores/FileStoreController";
import ContentBrowserAPI from "../../../../../libs/files/ContentBrowserAPI";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FilesAPI.sep + newName : FilesAPI.sep + newName)
            await ContentBrowserAPI.rename(FileStoreController.ASSETS_PATH + item.id, FileStoreController.ASSETS_PATH + newNamePath)

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
                const targetPath = FileStoreController.ASSETS_PATH + (item.parent ? item.parent + FilesAPI.sep : FilesAPI.sep) + nameToApply

                if (!(await NodeFS.exists(targetPath))) {
                    await ContentBrowserAPI.rename(FileStoreController.ASSETS_PATH + item.id, targetPath)
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