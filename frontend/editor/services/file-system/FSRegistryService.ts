import FileSystemUtil from "../../../shared/lib/FileSystemUtil"
import {getCall} from "../../../shared/util/get-call"

import ElectronResources from "../../../shared/lib/ElectronResources"
import IPCRoutes from "../../../../shared/IPCRoutes";
import Folders from "../../../../shared/Folders";
import FileTypes from "../../../../shared/FileTypes";

export default class FSRegistryService {
	static registry: { [key: string]: RegistryFile } = {}

	static async readRegistry(): Promise<RegistryFile[]> {
		const registry = await getCall<{ [key: string]: RegistryFile }>(IPCRoutes.READ_REGISTRY, {}, false)
		FSRegistryService.registry = registry
		return Object.values(registry)
	}

	static async updateRegistry(from, to) {

		const fromResolved = FileSystemUtil.resolvePath(from).replace(FileSystemUtil.ASSETS_PATH, "")
		const toResolved = FileSystemUtil.resolvePath(to).replace(FileSystemUtil.ASSETS_PATH, "")
		const registryFound = Object.values(FSRegistryService.registry).find(reg => {
			const regResolved = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + reg.path).replace(FileSystemUtil.ASSETS_PATH, "")
			return regResolved === fromResolved
		})
		if (registryFound) {
			registryFound.path = toResolved
			ElectronResources.ipcRenderer.send(IPCRoutes.UPDATE_REG, {id: registryFound.id, data: registryFound})
		}
	}

	static async createRegistryEntry(fID = crypto.randomUUID(), pathToFile) {
		await getCall<undefined>(IPCRoutes.CREATE_REG, {id: fID, path: pathToFile}, false)
	}

	static getByPath(path) {
		const obj = Object.values(FSRegistryService.registry)
		for (let i = 0; i < obj.length; i++) {
			const c = obj[i]
			if (c.path === path)
				return c.id
		}
	}

	static getRegistryEntry(id) {
		return FSRegistryService.registry[id]
	}

	static async findRegistry(p) {
		const res = await FileSystemUtil.readdir(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY))
		if (res) {
			const registryData = await Promise.all(res.map(data => FSRegistryService.getRegistryEntry(data.replace(FileTypes.REGISTRY, ""))))
			const parsedPath = FileSystemUtil.resolvePath(p)
			return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
		}
	}

}