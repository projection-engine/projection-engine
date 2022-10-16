import NodeFS from "shared-resources/frontend/libs/NodeFS"
import FilesStore from "../../../stores/FilesStore";
import ContentBrowserAPI from "../../../libs/ContentBrowserAPI";

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + NodeFS.sep + newName : NodeFS.sep + newName)
            await ContentBrowserAPI.rename(NodeFS.ASSETS_PATH  + item.id, NodeFS.ASSETS_PATH  + newNamePath)

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
                const targetPath = NodeFS.ASSETS_PATH  + (item.parent ? item.parent + NodeFS.sep : NodeFS.sep) + nameToApply

                if (!(await NodeFS.exists(targetPath))) {
                    await ContentBrowserAPI.rename(NodeFS.ASSETS_PATH  + item.id, targetPath)
                    FilesStore.refreshFiles().catch()
                }
            }
            setCurrentItem()
        }
    }
    else
        setCurrentItem()
}