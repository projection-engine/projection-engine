import FilesStore from "../../../../shared/stores/FilesStore"
import FSRegistryService from "../../../services/file-system/FSRegistryService"
import ContentBrowserAPI from "../../../services/file-system/ContentBrowserAPI"

import FileSystemService from "../../../../shared/lib/FileSystemService"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
import LocalizationEN from "../../../../../shared/LocalizationEN";


export default async function handleDropFolder(event:string[]|string, target?:string) {
	try {
		const items = Array.isArray(event) ? event : JSON.parse(event)
		for (let i = 0; i < items.length; i++) {
			const textData = items[i]

			if (target !== FileSystemService.getInstance().sep) {
				let from = textData
				if (!from.includes(FileSystemService.getInstance().sep)) {
					const reg = FSRegistryService.getRegistryEntry(from)
					if (reg) from = reg.path
					else {
						console.error("Some error occurred")
						return
					}
				}
				const to = target + FileSystemService.getInstance().sep + from.split(FileSystemService.getInstance().sep).pop()

				const toItem = FilesStore.data.items.find(f => f.id === target)
				const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
				if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
					await ContentBrowserAPI.rename(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + from), FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + to))
					await FilesStore.refreshFiles()
				}
			} else if (textData.includes(FileSystemService.getInstance().sep)) {
				const newPath = FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + textData.split(FileSystemService.getInstance().sep).pop()
				if (!FileSystemService.getInstance().exists(newPath)) {
					await ContentBrowserAPI.rename(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + textData), FileSystemService.getInstance().resolvePath(newPath))
					await FilesStore.refreshFiles()
				} else ToastNotificationSystem.getInstance().error(LocalizationEN.ITEM_ALREADY_EXISTS)
			}
		}
	} catch (error) {
		console.error(error)
	}
}