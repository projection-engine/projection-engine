import FSRegistryService from "./FSRegistryService"
import FileSystemUtil from "../../../shared/FileSystemUtil"
import Folders from "../../../../shared/Folders"

export default class FSAssetUtil {
	static async readAsset<T>(idOrPath: string): Promise<T> {
		if(!idOrPath)
			return
		const isPath = FileSystemUtil.resolvePath(idOrPath).includes(FileSystemUtil.resolvePath(FileSystemUtil.path))
		if (!isPath) {
			const reg = FSRegistryService.getRegistryEntry(idOrPath)
			if (reg)
				return <T>(await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + reg.path))
			return
		}
		return <T>(await FileSystemUtil.readFile(idOrPath))
	}


	static async writeAsset(path, fileData, previewImage?: boolean, registryID?: string) {
		const fileID = registryID !== undefined ? registryID : crypto.randomUUID()
		await FileSystemUtil.write(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path), fileData)
		if (previewImage)
			await FileSystemUtil.write(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep + registryID + ".preview"), previewImage)
		await FSRegistryService.createRegistryEntry(fileID, path)
	}

	static async updateAsset(registryID, fileData, previewImage?: boolean) {
		const res = FSRegistryService.getRegistryEntry(registryID)
		if (res)
			await FSAssetUtil.writeAsset(res.path, fileData, previewImage, registryID)
	}


}