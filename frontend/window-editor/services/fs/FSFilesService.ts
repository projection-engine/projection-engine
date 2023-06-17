import FSRegistryService from "./FSRegistryService"

import FS from "../../../shared/lib/FS/FS"
import ElectronResources from "../../../shared/lib/ElectronResources"
import Folders from "../../../../contants/Folders";
import IPCRoutes from "../../../../contants/IPCRoutes";


export default class FSFilesService {
	static sep = ElectronResources.path.sep
	static registry = []

	static async initializeFolders(): Promise<void> {
		await FS.mkdir(FS.TEMP)
		if (FS.exists(FS.path + FS.sep + Folders.PREVIEWS)) await FS.mkdir(FS.path + FS.sep + Folders.PREVIEWS)
		if (FS.exists(FS.path + FS.sep + Folders.ASSETS)) await FS.mkdir(FS.path + FS.sep + Folders.ASSETS)
		if (FS.exists(FS.path + FS.sep + Folders.REGISTRY)) await FS.mkdir(FS.path + FS.sep + Folders.REGISTRY)
	}

	static async writeFile(pathName: string, data: any, absolute: boolean) {
		try {
			await FS.write(FS.resolvePath(!absolute ? FS.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data)
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

		const currentPath = FS.resolvePath(pathName)

		for (let i = 0; i < FSFilesService.registry.length; i++) {
			const r = FSFilesService.registry[i]
			const rPath = FS.resolvePath(FS.ASSETS_PATH + FS.sep + r.path)
			if (rPath.includes(currentPath))
				await FS.rm(FS.resolvePath(FS.path + FS.sep + Folders.REGISTRY + FS.sep + r.id + ".reg"))
		}
		await FS.rm(currentPath, options)

		const rs = await FSRegistryService.findRegistry(currentPath)
		if (rs) await FS.rm(FS.resolvePath(FS.path + FS.sep + Folders.REGISTRY + FS.sep + rs.id + ".reg"))
	}


}


