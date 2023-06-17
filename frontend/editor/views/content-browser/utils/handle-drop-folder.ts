import FilesStore from "../../../../shared/stores/FilesStore"
import FSRegistryService from "../../../services/file-system/FSRegistryService"
import ContentBrowserAPI from "../../../services/file-system/ContentBrowserAPI"

import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"
import AlertController from "../../../../shared/components/alert/AlertController"
import LocalizationEN from "../../../../../shared/LocalizationEN";


export default async function handleDropFolder(event:string[]|string, target?:string) {
	try {
		const items = Array.isArray(event) ? event : JSON.parse(event)
		for (let i = 0; i < items.length; i++) {
			const textData = items[i]

			if (target !== FileSystemUtil.sep) {
				let from = textData
				if (!from.includes(FileSystemUtil.sep)) {
					const reg = FSRegistryService.getRegistryEntry(from)
					if (reg) from = reg.path
					else {
						console.error("Some error occurred")
						return
					}
				}
				const to = target + FileSystemUtil.sep + from.split(FileSystemUtil.sep).pop()

				const toItem = FilesStore.data.items.find(f => f.id === target)
				const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
				if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
					await ContentBrowserAPI.rename(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + from), FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + to))
					await FilesStore.refreshFiles()
				}
			} else if (textData.includes(FileSystemUtil.sep)) {
				const newPath = FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + textData.split(FileSystemUtil.sep).pop()
				if (!FileSystemUtil.exists(newPath)) {
					await ContentBrowserAPI.rename(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + textData), FileSystemUtil.resolvePath(newPath))
					await FilesStore.refreshFiles()
				} else AlertController.error(LocalizationEN.ITEM_ALREADY_EXISTS)
			}
		}
	} catch (error) {
		console.error(error)
	}
}