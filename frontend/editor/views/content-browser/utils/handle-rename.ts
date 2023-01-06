import FilesStore from "../../../stores/FilesStore";
import ContentBrowserAPI from "../../../lib/fs/ContentBrowserAPI";
import FS from "../../../../lib/FS/FS";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FS.sep + newName : FS.sep + newName)
            await ContentBrowserAPI.rename(FS.ASSETS_PATH  + item.id, FS.ASSETS_PATH  + newNamePath)

            if (item.id === currentDirectory.id)
                setCurrentDirectory(prev => {
                    return {
                        ...prev,
                        id: newNamePath
                    }
                })
            FilesStore.refreshFiles().catch()
        } else {
            const nameToApply = newName + "." + item.type
            if (newName !== item.name) {
                const targetPath = FS.ASSETS_PATH  + (item.parent ? item.parent + FS.sep : FS.sep) + nameToApply

                if ( FS.exists(targetPath)) {
                    await ContentBrowserAPI.rename(FS.ASSETS_PATH  + item.id, targetPath)
                    FilesStore.refreshFiles().catch()
                }
            }
            setCurrentItem()
        }
    }
    else
        setCurrentItem()
}