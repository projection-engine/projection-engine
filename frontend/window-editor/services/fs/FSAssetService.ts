import FSRegistryService from "./FSRegistryService"
import FSFilesService from "./FSFilesService"
import FS from "../../../shared/lib/FS/FS"
import Folders from "../../../../contants/Folders";

export default class FSAssetService {
	static async readAsset<T>(idOrPath: string): Promise<T> {
		if(!idOrPath)
			return
		const isPath = FS.resolvePath(idOrPath).includes(FS.resolvePath(FS.path))
		if (!isPath) {
			const reg = FSRegistryService.getRegistryEntry(idOrPath)
			if (reg)
				return <T>(await FSFilesService.readFile(FS.ASSETS_PATH + FS.sep + reg.path))
			return
		}
		return <T>(await FSFilesService.readFile(idOrPath))
	}


	static async writeAsset(path, fileData, previewImage?: boolean, registryID?: string) {
		const fileID = registryID !== undefined ? registryID : crypto.randomUUID()
		await FS.write(FS.resolvePath(FS.ASSETS_PATH + FS.sep + path), fileData)
		if (previewImage)
			await FS.write(FS.resolvePath(FS.path + FS.sep + Folders.PREVIEWS + FS.sep + registryID + ".preview"), previewImage)
		await FSRegistryService.createRegistryEntry(fileID, path)
	}

	static async updateAsset(registryID, fileData, previewImage?: boolean) {
		const res = FSRegistryService.getRegistryEntry(registryID)
		if (res)
			await FSAssetService.writeAsset(res.path, fileData, previewImage, registryID)
	}


}