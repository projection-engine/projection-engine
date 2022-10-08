import FilesAPI from "../../../../shared/libs/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import Localization from "../../../../shared/libs/Localization";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries
    FilesStore.removeBlock(itemsToDelete)
    alert.pushAlert(Localization.PROJECT.FILES.DELETING_ITEMS, "info")
    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const file = FilesStore.data.items.find(e => e.id === currentItem)
        if (!file)
            continue
        const relatedFiles =  FilesStore.data.items.filter(item => item.id.includes(currentItem.id))
        for (let j = 0; j < relatedFiles.length; j++) {
            const currentFile = relatedFiles[j]
            await FilesAPI.deleteFile(
                NodeFS.ASSETS_PATH + NodeFS.sep + currentFile.id,
                {
                    recursive: true,
                    force: true
                })
            if (currentDirectory.id === currentFile.id)
                setCurrentDirectory({id: NodeFS.sep})
        }
        await FilesAPI.deleteFile(
            NodeFS.ASSETS_PATH + NodeFS.sep + file.id,
            {
                recursive: true,
                force: true
            })
        if (currentDirectory.id === file.id)
            setCurrentDirectory({id: NodeFS.sep})
    }

    await FilesStore.refreshFiles()
    alert.pushAlert(Localization.PROJECT.FILES.SUCCESSFUL_DELETE, "success")
}