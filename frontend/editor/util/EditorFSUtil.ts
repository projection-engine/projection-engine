import ElectronResources from "../../shared/lib/ElectronResources"
import IPCRoutes from "../../../shared/enums/IPCRoutes"
import Folders from "../../../shared/enums/Folders"
import FileTypes from "../../../shared/enums/FileTypes"
import EditorUtil from "./EditorUtil"
import FileSystemUtil from "../../shared/FileSystemUtil"

export default class EditorFSUtil {
	static registry: { [key: string]: RegistryFile } = {}
	static registryList:  RegistryFile[] = []

	static async readRegistry(){
		const registry = await EditorUtil.getCall<{ [key: string]: RegistryFile }>(IPCRoutes.READ_REGISTRY, {}, false)
		EditorFSUtil.registry = registry
		EditorFSUtil.registryList = Object.values(registry)
	}

	static async updateRegistry(from, to) {

		const fromResolved = FileSystemUtil.resolvePath(from).replace(FileSystemUtil.ASSETS_PATH, "")
		const toResolved = FileSystemUtil.resolvePath(to).replace(FileSystemUtil.ASSETS_PATH, "")
		const registryFound = Object.values(EditorFSUtil.registry).find(reg => {
			const regResolved = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + reg.path).replace(FileSystemUtil.ASSETS_PATH, "")
			return regResolved === fromResolved
		})
		if (registryFound) {
			registryFound.path = toResolved
			ElectronResources.ipcRenderer.send(IPCRoutes.UPDATE_REG, {id: registryFound.id, data: registryFound})
		}
	}

	static async createRegistryEntry(fID = crypto.randomUUID(), pathToFile) {
		await EditorUtil.getCall<undefined>(IPCRoutes.CREATE_REG, {id: fID, path: pathToFile}, false)
	}

	static getByPath(path) {
		const obj = Object.values(EditorFSUtil.registry)
		for (let i = 0; i < obj.length; i++) {
			const c = obj[i]
			if (c.path === path)
				return c.id
		}
	}

	static getRegistryEntry(id) {
		return EditorFSUtil.registry[id]
	}

	static async findRegistry(p) {
		const res = await FileSystemUtil.readdir(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY))
		if (res) {
			const registryData = await Promise.all(res.map(data => EditorFSUtil.getRegistryEntry(data.replace(FileTypes.REGISTRY, ""))))
			const parsedPath = FileSystemUtil.resolvePath(p)
			return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
		}
	}

	static async readAsset<T>(idOrPath: string): Promise<T> {
		if(!idOrPath)
			return
		const isPath = FileSystemUtil.resolvePath(idOrPath).includes(FileSystemUtil.resolvePath(FileSystemUtil.path))
		if (!isPath) {
			const reg = EditorFSUtil.getRegistryEntry(idOrPath)
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
		await EditorFSUtil.createRegistryEntry(fileID, path)
	}

	static async updateAsset(registryID, fileData, previewImage?: boolean) {
		const res = EditorFSUtil.getRegistryEntry(registryID)
		if (res)
			await EditorFSUtil.writeAsset(res.path, fileData, previewImage, registryID)
	}

}