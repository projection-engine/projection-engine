import FilesAPI from "../../../lib/fs/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import Localization from "../../../templates/LOCALIZATION_EN";
import ConsoleAPI from "../../../../../engine-core/lib/utils/ConsoleAPI";
import NodeFS from "../../../../shared/libs/NodeFS";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

    console.warn(Localization.DELETING_ITEMS)
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
    console.log(Localization.SUCCESSFUL_DELETE)
}