import FileSystem from "../../../../../libs/FileSystem"
import FileStoreController from "../../../stores/FileStoreController";
import Localization from "../../../../../libs/Localization";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries
    FileStoreController.removeBlock(itemsToDelete)

    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const file = FileStoreController.data.items.find(e => e.id === currentItem)
        if (!file)
            continue
        const relatedFiles =  FileStoreController.data.items.filter(item => item.id.includes(currentItem.id))
        for (let j = 0; j < relatedFiles.length; j++) {
            const currentFile = relatedFiles[j]
            await window.fileSystem.deleteFile(
                "assets" + FileSystem.sep + currentFile.id,
                {
                    recursive: true,
                    force: true
                })
            if (currentDirectory.id === currentFile.id)
                setCurrentDirectory({id: FileSystem.sep})
        }
        await window.fileSystem.deleteFile(
            "assets" + FileSystem.sep + file.id,
            {
                recursive: true,
                force: true
            })
        if (currentDirectory.id === file.id)
            setCurrentDirectory({id: FileSystem.sep})
    }

    await FileStoreController.refreshFiles()
    alert.pushAlert(Localization.PROJECT.FILES.SUCCESSFUL_DELETE, "success")
}