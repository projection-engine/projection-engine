import FilesStore from "../../../../shared/stores/FilesStore"
import ContentBrowserAPI from "../../../services/file-system/ContentBrowserAPI"
import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory) {
	if (newName === item.name)
		return

	if (item.isFolder) {
		const newNamePath = (item.parent ? item.parent + FileSystemUtil.sep + newName : FileSystemUtil.sep + newName)
		await ContentBrowserAPI.rename(FileSystemUtil.ASSETS_PATH + item.id, FileSystemUtil.ASSETS_PATH + newNamePath)
		await FilesStore.refreshFiles().catch()
		if (item.id === currentDirectory.id)
			setCurrentDirectory({id: newNamePath})
		return
	}

	const nameToApply = newName + "." + item.type
	const targetPath = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + (item.parent ? item.parent + FileSystemUtil.sep : FileSystemUtil.sep) + nameToApply)

	if (FileSystemUtil.exists(targetPath))
		return

	await ContentBrowserAPI.rename(FileSystemUtil.ASSETS_PATH + item.id, targetPath)
	await FilesStore.refreshFiles().catch()
}