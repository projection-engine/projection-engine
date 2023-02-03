import FilesAPI from "../../../lib/fs/FilesAPI"
import FilesStore from "../../../../shared/stores/FilesStore";
import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
import FS from "../../../../shared/lib/FS/FS";
import AlertController from "../../../../shared/components/alert/AlertController";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

    AlertController.warn(LOCALIZATION_EN.DELETING_ITEMS)
    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const file = FilesStore.data.items.find(e => e.id === currentItem)
        if (!file)
            continue
        const relatedFiles =  FilesStore.data.items.filter(item => item.id.includes(currentItem.id))
        for (let j = 0; j < relatedFiles.length; j++) {
            const currentFile = relatedFiles[j]
            await FilesAPI.deleteFile(
                FS.ASSETS_PATH + FS.sep + currentFile.id,
                {
                    recursive: true,
                    force: true
                })
            if (currentDirectory.id === currentFile.id)
                setCurrentDirectory({id: FS.sep})
        }
        await FilesAPI.deleteFile(
            FS.ASSETS_PATH + FS.sep + file.id,
            {
                recursive: true,
                force: true
            })
        if (currentDirectory.id === file.id)
            setCurrentDirectory({id: FS.sep})
    }

    await FilesStore.refreshFiles().catch()
    AlertController.success(LOCALIZATION_EN.SUCCESSFUL_DELETE)
}