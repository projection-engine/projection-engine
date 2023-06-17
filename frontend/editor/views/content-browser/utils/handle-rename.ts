import FilesStore from "../../../../shared/stores/FilesStore"
import ContentBrowserAPI from "../../../services/file-system/ContentBrowserAPI"
import FileSystemService from "../../../../shared/lib/FileSystemService"

export default async function handleRename(item, newName, currentDirectory, setCurrentDirectory) {
	if (newName === item.name)
		return

	if (item.isFolder) {
		const newNamePath = (item.parent ? item.parent + FileSystemService.getInstance().sep + newName : FileSystemService.getInstance().sep + newName)
		await ContentBrowserAPI.rename(FileSystemService.getInstance().ASSETS_PATH + item.id, FileSystemService.getInstance().ASSETS_PATH + newNamePath)
		await FilesStore.refreshFiles().catch()
		if (item.id === currentDirectory.id)
			setCurrentDirectory({id: newNamePath})
		return
	}

	const nameToApply = newName + "." + item.type
	const targetPath = FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + (item.parent ? item.parent + FileSystemService.getInstance().sep : FileSystemService.getInstance().sep) + nameToApply)

	if (FileSystemService.getInstance().exists(targetPath))
		return

	await ContentBrowserAPI.rename(FileSystemService.getInstance().ASSETS_PATH + item.id, targetPath)
	await FilesStore.refreshFiles().catch()
}