import EditorFSUtil from "../editor/util/EditorFSUtil"
import ElectronResources from "./lib/ElectronResources"
import Folders from "../../../shared/enums/Folders"
import IPCRoutes from "../../../shared/enums/IPCRoutes"
import FileTypes from "../../../shared/enums/FileTypes"
import EditorUtil from "../editor/util/EditorUtil"


export default class FileSystemUtil {
	static path?: string
	static TEMP?: string
	static PREVIEW_PATH?: string
	static rootDir = ElectronResources.os.homedir()
	static ASSETS_PATH?: string
	static sep = ElectronResources.path.sep

	static async initializeFolders(pathToProject): Promise<void> {

		FileSystemUtil.path = ElectronResources.path.resolve(pathToProject.replace(FileTypes.PROJECT, "") + FileSystemUtil.sep)
		FileSystemUtil.TEMP = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.TEMP + FileSystemUtil.sep)
		FileSystemUtil.PREVIEW_PATH = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep)
		FileSystemUtil.ASSETS_PATH = ElectronResources.path.resolve(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS + FileSystemUtil.sep)

		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.ASSETS)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY)
		if (FileSystemUtil.exists(FileSystemUtil.path + FileSystemUtil.sep + Folders.TEMP)) await FileSystemUtil.mkdir(FileSystemUtil.path + FileSystemUtil.sep + Folders.TEMP)
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
		const registry = EditorFSUtil.registryList
		for (let i = 0; i < registry.length; i++) {
			const r = registry[i]
			const rPath = FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + r.path)
			if (rPath.includes(currentPath))
				await FileSystemUtil.rm(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY + FileSystemUtil.sep + r.id + ".reg"))
		}
		await FileSystemUtil.rm(currentPath, options)

		const rs = await EditorFSUtil.findRegistry(currentPath)
		if (rs) await FileSystemUtil.rm(FileSystemUtil.resolvePath(FileSystemUtil.path + FileSystemUtil.sep + Folders.REGISTRY + FileSystemUtil.sep + rs.id + ".reg"))
	}

	static resolvePath(path: string): string {
		if (!path)
			return path
		return ElectronResources.path.resolve(path)
	}

	static async read(path: string, options?: MutableObject | string): Promise<any> {
		return EditorUtil.getCall(IPCRoutes.FS_READ, {path, options}, false)
	}

	static async write(path: string, data: any) {
		return EditorUtil.getCall(IPCRoutes.FS_WRITE, {path, data}, false)
	}

	static async rm(path: string, options?: MutableObject | string) {
		return EditorUtil.getCall(IPCRoutes.FS_RM, {path, options}, false)
	}

	static async mkdir(path: string) {
		return EditorUtil.getCall(IPCRoutes.FS_MKDIR, {path}, false)
	}

	static async stat(path: string, options?: MutableObject | string): Promise<MutableObject> {
		return EditorUtil.getCall(IPCRoutes.FS_STAT, {path, options}, false)
	}

	static exists(path: string): boolean {
		return ElectronResources.fs.existsSync(ElectronResources.path.resolve(path))
	}

	static async readdir(path: string, options?: MutableObject | string): Promise<MutableObject[]> {
		return EditorUtil.getCall<MutableObject[]>(IPCRoutes.FS_READDIR, {path, options}, false)
	}

	static async rename(oldPath: string, newPath: string) {
		return EditorUtil.getCall(IPCRoutes.FS_RENAME, {oldPath, newPath}, false)
	}
}


