import FSFilesService from "../../../services/file-system/FSFilesService"
import FilesStore from "../../../../shared/stores/FilesStore"

import FileSystemService from "../../../../shared/lib/FileSystemService"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../../shared/LocalizationEN"

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
	const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

	ToastNotificationSystem.getInstance().warn(LocalizationEN.DELETING_ITEMS)
	for (let i = 0; i < itemsToDelete.length; i++) {
		const currentItem = itemsToDelete[i]
		const file = FilesStore.data.items.find(e => e.id === currentItem)
		if (!file)
			continue
		const relatedFiles =  FilesStore.data.items.filter(item => item.id.includes(currentItem.id))
		for (let j = 0; j < relatedFiles.length; j++) {
			const currentFile = relatedFiles[j]
			await FSFilesService.deleteFile(
				FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + currentFile.id,
				{
					recursive: true,
					force: true
				})
			if (currentDirectory.id === currentFile.id)
				setCurrentDirectory({id: FileSystemService.getInstance().sep})
		}
		await FSFilesService.deleteFile(
			FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + file.id,
			{
				recursive: true,
				force: true
			})
		if (currentDirectory.id === file.id)
			setCurrentDirectory({id: FileSystemService.getInstance().sep})
	}

	await FilesStore.refreshFiles().catch()
	ToastNotificationSystem.getInstance().success(LocalizationEN.SUCCESSFUL_DELETE)
}