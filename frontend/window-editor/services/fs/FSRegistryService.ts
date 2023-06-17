import FS from "../../../shared/lib/FS/FS"
import {getCall} from "../../../shared/lib/FS/get-call"

import ElectronResources from "../../../shared/lib/ElectronResources"
import IPCRoutes from "../../../../contants/IPCRoutes";
import Folders from "../../../../contants/Folders";
import FileTypes from "../../../../contants/FileTypes";

export default class FSRegistryService {
	static registry: { [key: string]: RegistryFile } = {}

	static async readRegistry(): Promise<RegistryFile[]> {
		const registry = await getCall<{ [key: string]: RegistryFile }>(IPCRoutes.READ_REGISTRY, {}, false)
		FSRegistryService.registry = registry
		return Object.values(registry)
	}

	static async updateRegistry(from, to) {

		const fromResolved = FS.resolvePath(from).replace(FS.ASSETS_PATH, "")
		const toResolved = FS.resolvePath(to).replace(FS.ASSETS_PATH, "")
		const registryFound = Object.values(FSRegistryService.registry).find(reg => {
			const regResolved = FS.resolvePath(FS.ASSETS_PATH + FS.sep + reg.path).replace(FS.ASSETS_PATH, "")
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
		const res = await FS.readdir(FS.resolvePath(FS.path + FS.sep + Folders.REGISTRY))
		if (res) {
			const registryData = await Promise.all(res.map(data => FSRegistryService.getRegistryEntry(data.replace(FileTypes.REGISTRY, ""))))
			const parsedPath = FS.resolvePath(p)
			return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
		}
	}

}