import FSRegistryService from "./FSRegistryService"
import FSFilesService from "./FSFilesService"
import FileSystemUtil from "../../../shared/lib/FileSystemUtil"
import Folders from "../../../../shared/Folders";

export default class FSAssetService {
	static async readAsset<T>(idOrPath: string): Promise<T> {
		if(!idOrPath)
			return
		const isPath = FileSystemUtil.resolvePath(idOrPath).includes(FileSystemUtil.resolvePath(FileSystemUtil.path))
		if (!isPath) {
			const reg = FSRegistryService.getRegistryEntry(idOrPath)
			if (reg)
				return <T>(await FSFilesService.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + reg.path))
			return
		}
		return <T>(await FSFilesService.readFile(idOrPath))
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
			await FSAssetService.writeAsset(res.path, fileData, previewImage, registryID)
	}


}