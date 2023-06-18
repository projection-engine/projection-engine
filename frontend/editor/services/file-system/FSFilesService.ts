import FSRegistryService from "./FSRegistryService"

import FileSystemService from "../../../shared/lib/FileSystemService"
import ElectronResources from "../../../shared/lib/ElectronResources"
import Folders from "../../../../shared/Folders";
import IPCRoutes from "../../../../shared/IPCRoutes";


export default class FSFilesService {
	static sep = ElectronResources.path.sep
	static registry = []

	static async initializeFolders(): Promise<void> {
		await FileSystemService.getInstance().mkdir(FileSystemService.getInstance().TEMP)
		if (FileSystemService.getInstance().exists(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.PREVIEWS)) await FileSystemService.getInstance().mkdir(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.PREVIEWS)
		if (FileSystemService.getInstance().exists(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.ASSETS)) await FileSystemService.getInstance().mkdir(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.ASSETS)
		if (FileSystemService.getInstance().exists(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.REGISTRY)) await FileSystemService.getInstance().mkdir(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.REGISTRY)
	}

	static async writeFile(pathName: string, data: any, absolute: boolean) {
		try {
			await FileSystemService.getInstance().write(FileSystemService.getInstance().resolvePath(!absolute ? FileSystemService.getInstance().path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
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

		const currentPath = FileSystemService.getInstance().resolvePath(pathName)

		for (let i = 0; i < FSFilesService.registry.length; i++) {
			const r = FSFilesService.registry[i]
			const rPath = FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + r.path)
			if (rPath.includes(currentPath))
				await FileSystemService.getInstance().rm(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.REGISTRY + FileSystemService.getInstance().sep + r.id + ".reg"))
		}
		await FileSystemService.getInstance().rm(currentPath, options)

		const rs = await FSRegistryService.findRegistry(currentPath)
		if (rs) await FileSystemService.getInstance().rm(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().path + FileSystemService.getInstance().sep + Folders.REGISTRY + FileSystemService.getInstance().sep + rs.id + ".reg"))
	}


}


