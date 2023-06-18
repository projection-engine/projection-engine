import FSRegistryService from "./FSRegistryService"

import FileSystemService from "../../../shared/lib/FileSystemService"
import ElectronResources from "../../../shared/lib/ElectronResources"
import Folders from "../../../../shared/Folders"
import IPCRoutes from "../../../../shared/IPCRoutes"


export default class FSFilesService {
	static sep = ElectronResources.path.sep
	static registry = []

	static async initializeFolders(): Promise<void> {
		const fsInstance = FileSystemService.getInstance()
		await fsInstance.mkdir(fsInstance.TEMP)
		if (fsInstance.exists(fsInstance.path + fsInstance.sep + Folders.PREVIEWS)) await fsInstance.mkdir(fsInstance.path + fsInstance.sep + Folders.PREVIEWS)
		if (fsInstance.exists(fsInstance.path + fsInstance.sep + Folders.ASSETS)) await fsInstance.mkdir(fsInstance.path + fsInstance.sep + Folders.ASSETS)
		if (fsInstance.exists(fsInstance.path + fsInstance.sep + Folders.REGISTRY)) await fsInstance.mkdir(fsInstance.path + fsInstance.sep + Folders.REGISTRY)
	}

	static async writeFile(pathName: string, data: any, absolute: boolean) {
		const fsInstance = FileSystemService.getInstance()
		try {
			await fsInstance.write(fsInstance.resolvePath(!absolute ? fsInstance.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
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
		const fsInstance = FileSystemService.getInstance()
		const currentPath = fsInstance.resolvePath(pathName)
		const registry = FSRegistryService.registryList
		for (let i = 0; i < registry.length; i++) {
			const r = registry[i]
			const rPath = fsInstance.resolvePath(fsInstance.ASSETS_PATH + fsInstance.sep + r.path)
			if (rPath.includes(currentPath))
				await fsInstance.rm(fsInstance.resolvePath(fsInstance.path + fsInstance.sep + Folders.REGISTRY + fsInstance.sep + r.id + ".reg"))
		}
		await fsInstance.rm(currentPath, options)

		const rs = await FSRegistryService.findRegistry(currentPath)
		if (rs) await fsInstance.rm(fsInstance.resolvePath(fsInstance.path + fsInstance.sep + Folders.REGISTRY + fsInstance.sep + rs.id + ".reg"))
	}


}


