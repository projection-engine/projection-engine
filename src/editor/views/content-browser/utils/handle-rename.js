import NodeFS from "../../../../shared/libs/NodeFS"
import FilesAPI from "../../../../shared/libs/files/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import ContentBrowserAPI from "../../../../shared/libs/files/ContentBrowserAPI";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FilesAPI.sep + newName : FilesAPI.sep + newName)
            await ContentBrowserAPI.rename(FilesStore.ASSETS_PATH + item.id, FilesStore.ASSETS_PATH + newNamePath)

            if (item.id === currentDirectory.id)
                setCurrentDirectory(prev => {
                    return {
                        ...prev,
                        id: newNamePath
                    }
                })
            FilesStore.refreshFiles().catch()
            FilesStore.renameBookmark(item.id, newNamePath)
        } else {
            const nameToApply = newName + "." + item.type
            if (newName !== item.name) {
                const targetPath = FilesStore.ASSETS_PATH + (item.parent ? item.parent + FilesAPI.sep : FilesAPI.sep) + nameToApply

                if (!(await NodeFS.exists(targetPath))) {
                    await ContentBrowserAPI.rename(FilesStore.ASSETS_PATH + item.id, targetPath)
                    FilesStore.refreshFiles().catch()
                }
            }
            setCurrentItem()
        }
    }
    else
        setCurrentItem()
}