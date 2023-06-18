import FSRegistryService from "./FSRegistryService"
import FSFilesService from "./FSFilesService"
import FileSystemService from "../../../shared/lib/FileSystemService"
import Folders from "../../../../shared/Folders"

export default class FSAssetUtil {
	static async readAsset<T>(idOrPath: string): Promise<T> {
		if(!idOrPath)
			return
		const isPath = FileSystemService.getInstance().resolvePath(idOrPath).includes(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().path))
		if (!isPath) {
			const reg = FSRegistryService.getRegistryEntry(idOrPath)
			if (reg)
				return <T>(await FSFilesService.readFile(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + reg.path))
			return
		}
		return <T>(await FSFilesService.readFile(idOrPath))
	}


	static async writeAsset(path, fileData, previewImage?: boolean, registryID?: string) {
		const fileID = registryID !== undefined ? registryID : crypto.randomUUID()
		await FileSystemService.getInstance().write(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + path), fileData)
		if (previewImage)
			await FileSystemService.getInstance().write(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.PREVIEWS + FileSystemService.getInstance().sep + registryID + ".preview"), previewImage)
		await FSRegistryService.createRegistryEntry(fileID, path)
	}

	static async updateAsset(registryID, fileData, previewImage?: boolean) {
		const res = FSRegistryService.getRegistryEntry(registryID)
		if (res)
			await FSAssetUtil.writeAsset(res.path, fileData, previewImage, registryID)
	}


}