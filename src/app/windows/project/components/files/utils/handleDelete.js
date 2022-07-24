import FileSystem from "../../../libs/FileSystem"

export default async function handleDelete(entries, hook) {
    const itemsToDelete = !Array.isArray(entries) ? [entries] : entries
    hook.removeBlock(itemsToDelete)

    for (let i = 0; i < itemsToDelete.length; i++) {
        const currentItem = itemsToDelete[i]
        const file = hook.items.find(e => e.id === currentItem)
        if (!file)
            continue
        const relatedFiles = hook.items.filter(item => item.id.includes(currentItem.id))
        for (let j = 0; j < relatedFiles.length; j++) {
            const currentFile = relatedFiles[j]
            await window.fileSystem.deleteFile(
                "assets" + FileSystem.sep + currentFile.id,
                {
                    recursive: true,
                    force: true
                })
            if (hook.currentDirectory.id === currentFile.id)
                hook.setCurrentDirectory({id: FileSystem.sep})
        }
        await window.fileSystem.deleteFile(
            "assets" + FileSystem.sep + file.id,
            {
                recursive: true,
                force: true
            })
        if (hook.currentDirectory.id === file.id)
            hook.setCurrentDirectory({id: FileSystem.sep})
    }

    await hook.refreshFiles()
}