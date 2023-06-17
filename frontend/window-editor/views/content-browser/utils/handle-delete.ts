import FSFilesService from "../../../services/fs/FSFilesService"
import FilesStore from "../../../../shared/stores/FilesStore"

import FS from "../../../../shared/lib/FS/FS"
import AlertController from "../../../../shared/components/alert/AlertController"
import LocalizationEN from "../../../../../contants/LocalizationEN";

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
				FS.ASSETS_PATH + FS.sep + currentFile.id,
				{
					recursive: true,
					force: true
				})
			if (currentDirectory.id === currentFile.id)
				setCurrentDirectory({id: FS.sep})
		}
		await FSFilesService.deleteFile(
			FS.ASSETS_PATH + FS.sep + file.id,
			{
				recursive: true,
				force: true
			})
		if (currentDirectory.id === file.id)
			setCurrentDirectory({id: FS.sep})
	}

	await FilesStore.refreshFiles().catch()
	AlertController.success(LocalizationEN.SUCCESSFUL_DELETE)
}