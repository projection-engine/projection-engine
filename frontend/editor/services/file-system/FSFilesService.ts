import FSRegistryService from "./FSRegistryService"

import FileSystemUtil from "../../../shared/lib/FileSystemUtil"
import ElectronResources from "../../../shared/lib/ElectronResources"
import Folders from "../../../../shared/Folders";
import IPCRoutes from "../../../../shared/IPCRoutes";


export default class FSFilesService {
	static sep = ElectronResources.path.sep
	static registry = []

	static async initializeFolders(): Promise<void> {
		await FileSystemUtil.mkdir(FileSystemUtil.TEMP)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY)
	}

	static async writeFile(pathName: string, data: any, absolute: boolean) {
		try {
			await FileSystemUtil.write(FileSystemUtil.resolvePath(!absolute ? FileSystemUtil.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
		} catch (err) {
			console.error(err)
		}
	}

	static readFile(pathName: string, type?: string): Promise<any> {
		return new Promise(resolve => {
			const listenID = crypto.randomUUID()
			ElectronResources.ipcRenderer.once(IPCRoutes.READ_FILE + listenID, (ev, data) => resolve(data))
			ElectronResources.ipcRenderer.send(IPCRoutes.READ_FILE, {pathName, type, listenID})
		})
	}


	static async deleteFile(pathName, options) {

		const currentPath = FileSystemUtil.resolvePath(pathName)

		for (let i = 0; i < FSFilesService.registry.length; i++) {
			const r = FSFilesService.registry[i]
			const rPath = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + r.path)
			if (rPath.includes(currentPath))
				await FileSystemUtil.rm(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY + FileSystemUtil.sep + r.id + ".reg"))
		}
		await FileSystemUtil.rm(currentPath, options)

		const rs = await FSRegistryService.findRegistry(currentPath)
		if (rs) await FileSystemUtil.rm(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY + FileSystemUtil.sep + rs.id + ".reg"))
	}


}


