import FSFilesService from "../../../services/file-system/FSFilesService"
import FilesStore from "../../../../shared/stores/FilesStore"

import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"
import AlertController from "../../../../shared/components/alert/AlertController"
import LocalizationEN from "../../../../../shared/LocalizationEN";

export default async function handleDelete(entries, currentDirectory, setCurrentDirectory) {
	const itemsToDelete = !Array.isArray(entries) ? [entries] : entries

	AlertController.warn(LocalizationEN.DELETING_ITEMS)
	for (let i = 0; i < itemsToDelete.length; i++) {
		const currentItem = itemsToDelete[i]
		const file = FilesStore.data.items.find(e => e.id === currentItem)
		if (!file)
			continue
		const relatedFiles =  FilesStore.data.items.filter(item => item.id.includes(currentItem.id))
		for (let j = 0; j < relatedFiles.length; j++) {
			const currentFile = relatedFiles[j]
			await FSFilesService.deleteFile(
				FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + currentFile.id,
				{
					recursive: true,
					force: true
				})
			if (currentDirectory.id === currentFile.id)
				setCurrentDirectory({id: FileSystemUtil.sep})
		}
		await FSFilesService.deleteFile(
			FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + file.id,
			{
				recursive: true,
				force: true
			})
		if (currentDirectory.id === file.id)
			setCurrentDirectory({id: FileSystemUtil.sep})
	}

	await FilesStore.refreshFiles().catch()
	AlertController.success(LocalizationEN.SUCCESSFUL_DELETE)
}