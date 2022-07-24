import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"

export default async function handleRename(item, newName, hook, setCurrentItem) {
    if(newName !== item.name) {
        if (item.isFolder) {
            const newNamePath = (item.parent ? item.parent + FileSystem.sep + newName : FileSystem.sep + newName)
            await window.fileSystem
                .rename(hook.path + item.id, hook.path + newNamePath)

            if (item.id === hook.currentDirectory.id)
                hook.setCurrentDirectory(prev => {
                    return {
                        ...prev,
                        id: newNamePath
                    }
                })
            hook.refreshFiles().catch()
            hook.renameBookmark(item.id, newNamePath)
        } else {
            const nameToApply = newName + "." + item.type
            if (newName !== item.name) {
                const targetPath = hook.path + (item.parent ? item.parent + FileSystem.sep : FileSystem.sep) + nameToApply

                if (!(await AsyncFS.exists(targetPath))) {
                    await window
                        .fileSystem
                        .rename(hook.path + item.id, targetPath)
                    hook.refreshFiles().catch()
                } else
                    alert.pushAlert(
                        "Item already exists.",
                        "error"
                    )
            }
            setCurrentItem(undefined)
        }
    }
    else
        setCurrentItem(undefined)
}