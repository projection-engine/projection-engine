import NodeFS from "../../../../../libs/NodeFS"
import FilesAPI from "../../../../../libs/files/FilesAPI"
import CBStoreController from "../../../stores/CBStoreController";
import ContentBrowserAPI from "../../../../../libs/files/ContentBrowserAPI";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FilesAPI.sep + newName : FilesAPI.sep + newName)
            await ContentBrowserAPI.rename(CBStoreController.ASSETS_PATH + item.id, CBStoreController.ASSETS_PATH + newNamePath)

            if (item.id === currentDirectory.id)
                setCurrentDirectory(prev => {
                    return {
                        ...prev,
                        id: newNamePath
                    }
                })
            CBStoreController.refreshFiles().catch()
            CBStoreController.renameBookmark(item.id, newNamePath)
        } else {
            const nameToApply = newName + "." + item.type
            if (newName !== item.name) {
                const targetPath = CBStoreController.ASSETS_PATH + (item.parent ? item.parent + FilesAPI.sep : FilesAPI.sep) + nameToApply

                if (!(await NodeFS.exists(targetPath))) {
                    await ContentBrowserAPI.rename(CBStoreController.ASSETS_PATH + item.id, targetPath)
                    CBStoreController.refreshFiles().catch()
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