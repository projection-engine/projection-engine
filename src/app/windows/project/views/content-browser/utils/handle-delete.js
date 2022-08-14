import FilesAPI from "../../../../../libs/files/FilesAPI"
import CBStoreController from "../../../stores/CBStoreController";
import Localization from "../../../../../libs/Localization";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries
    CBStoreController.removeBlock(itemsToDelete)

    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const file = CBStoreController.data.items.find(e => e.id === currentItem)
        if (!file)
            continue
        const relatedFiles =  CBStoreController.data.items.filter(item => item.id.includes(currentItem.id))
        for (let j = 0; j < relatedFiles.length; j++) {
            const currentFile = relatedFiles[j]
            await FilesAPI.deleteFile(
                CBStoreController.ASSETS_PATH + FilesAPI.sep + currentFile.id,
                {
                    recursive: true,
                    force: true
                })
            if (currentDirectory.id === currentFile.id)
                setCurrentDirectory({id: FilesAPI.sep})
        }
        await FilesAPI.deleteFile(
            CBStoreController.ASSETS_PATH+ FilesAPI.sep + file.id,
            {
                recursive: true,
                force: true
            })
        if (currentDirectory.id === file.id)
            setCurrentDirectory({id: FilesAPI.sep})
    }

    await CBStoreController.refreshFiles()
    alert.pushAlert(Localization.PROJECT.FILES.SUCCESSFUL_DELETE, "success")
}